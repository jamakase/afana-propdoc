# Create DNS zone
resource "yandex_dns_zone" "primary" {
  name        = "primary-zone"
  description = "Primary DNS zone for the application"
  zone        = "banzai-team.ru."
  public      = true
}

resource "yandex_dns_recordset" "app" {
  zone_id = yandex_dns_zone.primary.id
  name    = "banzai-team.ru."
  type    = "A"
  ttl     = 200
  data    = [yandex_vpc_address.addr.external_ipv4_address[0].address]
}

resource "yandex_dns_recordset" "api" {
  zone_id = yandex_dns_zone.primary.id
  name    = "api.banzai-team.ru."
  type    = "A"
  ttl     = 200
  data    = [yandex_vpc_address.addr.external_ipv4_address[0].address]
}