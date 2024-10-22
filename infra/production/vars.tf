variable "cloud_id" {
  type = string
}

variable "folder_id" {
  type = string
}

variable "ssh_key" {
  type      = string
  sensitive = true
  default   = null
}

variable "ssh_key_file" {
  type    = string
  default = null
}

variable "openai_api_key" {
  type = string
  sensitive = true
}

variable "qdrant_api_key" {
  type = string
  sensitive = true
}