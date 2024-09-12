locals {
  ssh = var.ssh_key != null ? var.ssh_key : try(file(var.ssh_key_file))
}

data "yandex_compute_image" "container-optimized-image" {
  family = "container-optimized-image"
}

resource "yandex_iam_service_account" "sa-instance" {
  # count       = var.service_account_id == null ? 1 : 0
  name        = "${var.project}-instance"
  description = "service account to work with instance"
}

locals {
  service_account_id = coalesce(var.service_account_id, try(yandex_iam_service_account.sa-instance.id, null))
}

resource "yandex_vpc_security_group" "instance-sg" {
  name        = "${var.project}-instance-sg"
  description = "description for my security group"
  network_id  = var.network_id

  labels = {
  }

  ingress {
    protocol       = "ANY"
    description    = "https"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 443
    }

  ingress {
    protocol       = "ANY"
    description    = "https"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 80
    }

  ingress {
    protocol       = "ANY"
    description    = "https"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 6333
  }

  ingress {
    description       = "Communication inside this SG"
    from_port         = -1
    port              = -1
    predefined_target = "self_security_group"
    protocol          = "ANY"
    to_port           = -1
    v4_cidr_blocks    = []
    v6_cidr_blocks    = []
  }

  ingress {
    protocol       = "TCP"
    description    = "ssh"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 22
  }

  egress {
    protocol       = "ANY"
    description    = "any"
    v4_cidr_blocks = ["0.0.0.0/0"]
    from_port      = 0
    to_port        = 65535
  }
}

resource "yandex_compute_instance" "backend" {
  platform_id = var.platform_id

  boot_disk {
    initialize_params {
      name     = "admin"
      image_id = data.yandex_compute_image.container-optimized-image.id
      size = var.boot_disk_size
    }
  }

  service_account_id = local.service_account_id

  network_interface {
    subnet_id      = var.subnet_id
    nat            = true
    nat_ip_address = var.nat_ip_address

    #     security_group_ids = [yandex_vpc_security_group.group1.id]
    security_group_ids = [yandex_vpc_security_group.instance-sg.id]
  }

  resources {
    cores  = var.cpu
    memory = var.memory
    core_fraction = var.core_fraction
  }
  metadata = {
    "ssh-keys" = <<-EOT
                    yc-user:ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEi/t2y3WUENzZ2y8rvDzQu6+/GqQOvDqdaf8xLwCn0K jamakase@Artems-MacBook-Pro.local
            EOT
    docker-compose = var.compose_file
    user-data = file("${path.module}/cloud-config/cloud_config.yaml")
  }

  lifecycle {
    ignore_changes = [boot_disk[0].initialize_params[0].image_id]
  }

  allow_stopping_for_update = true
}
