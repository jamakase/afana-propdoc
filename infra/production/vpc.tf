
module "net" {
  source              = "github.com/terraform-yc-modules/terraform-yc-vpc"
  labels              = { tag = "prod", company : "level" }
  network_description = "Network for project"
  network_name        = "network"
  create_vpc          = true
  #   create_nat_gw = false
  public_subnets = [
    {
      "v4_cidr_blocks" : ["10.121.0.0/16"],
      "zone" : local.default_zone
    },
  ]
  #   private_subnets = [
  #     {
  #       "v4_cidr_blocks" : ["10.221.0.0/16"],
  #       "zone" : "ru-central1-a"
  #     },
  #   ]
  #   routes_public_subnets = [
  #     {
  #       destination_prefix : "172.16.0.0/16",
  #       next_hop_address : "10.131.0.10"
  #     },
  #   ]
  #     routes_private_subnets = [
  #       {
  #         destination_prefix : "172.16.0.0/16",
  #         next_hop_address : "10.231.0.10"
  #       },
  #     ]
}

resource "yandex_vpc_address" "addr" {
  name                = "static-compute-ip"
  deletion_protection = true
  external_ipv4_address {
    zone_id = local.default_zone
  }
}