resource "yandex_iam_service_account" "registry_pusher" {
  name        = "registry-pusher"
  description = "Service account for pushing to container registry"
  folder_id   = var.folder_id
}

resource "yandex_container_registry_iam_binding" "registry_pusher" {
  registry_id = yandex_container_registry.registry.id
  role        = "container-registry.images.pusher"

  members = [
    "serviceAccount:${yandex_iam_service_account.registry_pusher.id}",
  ]
}
