variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
}
variable "project_name" {
  description = "Name of project"
  type        = string
}
variable "bucket_name" {
  description = "Name of the S3 bucket to host the static website"
  type        = string
}
variable "environment" {
  description = "Deployment environment (prod)"
  type        = string
}