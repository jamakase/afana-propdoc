variable "cpu" {
  description = "Number of CPU cores for the instance"
  type        = number
  default     = 2
}

variable "memory" {
  description = "Amount of memory (in GB) for the instance"
  type        = number
  default     = 2
}

variable "core_fraction" {
  description = "Core fraction for the instance"
  type        = number
  default     = 100
}

variable "platform_id" {
  description = "Platform ID"
  type        = string
  default     = "standard-v3"
}

variable "ssh_key" {
  description = "SSH key for the instance"
  type        = string
  default     = null
}

variable "ssh_key_file" {
  description = "Path to the SSH key file"
  type        = string
  default     = null
}

variable "project" {
  description = "Project name"
  type        = string
}

variable "folder_id" {
  description = "Folder ID"
  type        = string
}

variable "compose_file" {
  description = "Compose file"
  type        = string
}

variable "network_id" {
  description = "Network ID"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID"
  type        = string
}

variable "nat_ip_address" {
  description = "NAT IP address"
  type        = string
}

variable "boot_disk_size" {
  description = "Boot disk size"
  type        = number
  default     = 15
}

variable "service_account_id" {
  description = "Service account ID"
  type        = string
  default     = null
}
