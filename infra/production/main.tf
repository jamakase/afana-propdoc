locals {
  ssh = var.ssh_key != null ? var.ssh_key : try(file(var.ssh_key_file))
}

module "app" {
  source = "./modules/app"
  project = "staging"
  folder_id = var.folder_id

  compose_file = file("${path.module}/files/docker-compose.vpn.yaml")
  ssh_key = local.ssh
  network_id = module.net.vpc_id
  subnet_id = module.net.public_subnets["10.121.0.0/16"].subnet_id
  nat_ip_address = yandex_vpc_address.addr.external_ipv4_address[0].address

  core_fraction = 20
}