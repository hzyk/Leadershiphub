terraform {
  backend "s3" { 
    bucket         = "kanyuy-frontend-static-2025"
    key            = "Leadershiphub/terraform.tfstate"
    region         = "af-south-1"
    use_lockfile   = true
  }
}

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
