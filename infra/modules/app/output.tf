output "server_ip" {
  value = yandex_compute_instance.backend.network_interface.0.nat_ip_address
}

output "service_account_id" {
  value = local.service_account_id
}