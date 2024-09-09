resource "yandex_container_registry" "registry" {
  name = "registry"
  folder_id = var.folder_id
}

resource "yandex_container_registry_iam_binding" "public_read_access" {
  registry_id = yandex_container_registry.registry.id
  role        = "container-registry.images.puller"

  members = [
    "system:allUsers",
  ]
}
