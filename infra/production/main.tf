locals {
  ssh = var.ssh_key != null ? var.ssh_key : try(file(var.ssh_key_file))
}

locals {
  default_zone = "ru-central1-a"
}

module "app" {
  source = "../modules/app"
  project = "production"
  folder_id = var.folder_id

  compose_file = templatefile("${path.module}/files/docker-compose.yaml", {
    HOST = "banzai-team.ru"
    POSTGRES_USER     = "user"
    POSTGRES_PASSWORD = "password"
    POSTGRES_DB       = "afana_propdoc"

    REDIS_PASSWORD = "password"

    APP_SECRET_KEY = "_5#y2L\"F4Q8z\\n\\xec]/"

    ACCESS_CONTROL_ALLOW_ORIGIN = "http://banzai-team.ru:8080"

    BROKER_URL      = "redis://redis"
    RESULT_BACKEND  = "redis://redis"

    DATABASE_URL = "postgresql://user:password@db:5432/afana_propdoc"

    CELERY_BROKER_URL       = "redis://:password@redis:6379/0"
    CELERY_RESULT_BACKEND   = "redis://:password@redis:6379/0"
    OPENROUTER_API_KEY = "a"
    QDRANT_API_KEY = "somwerhjsadimqwe"
  })
  ssh_key = local.ssh
  network_id = module.net.vpc_id
  subnet_id = module.net.public_subnets["10.121.0.0/16"].subnet_id
  nat_ip_address = yandex_vpc_address.addr.external_ipv4_address[0].address

  core_fraction = 100
  memory = 12
  cpu = 4
}