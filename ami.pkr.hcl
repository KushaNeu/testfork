packer {
  required_plugins {
    amazon = {
      version = ">= 1.1.1"
      source = "github.com/hashicorp/amazon"
    }
  }
}


variable "source_ami" {
  type    = string
  default = "ami-08c40ec9ead489470" # Ubuntu 22.04 LTS"
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

# "timestamp" template function replacement
locals { timestamp = regex_replace(timestamp(), "[- TZ:]", "") }


source "amazon-ebs" "amiwebapp" {

    ami_name        = "csye6225_${local.timestamp}"
    ami_description = "Ubuntu AMI for CSYE 6225"
    region          = "us-east-1"
    ami_users       = ["736170117686"]
    force_deregister       = true
    force_delete_snapshot  = true

    aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

    ami_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
  
  instance_type   = "t2.micro"
  profile         = "dev"
  
  skip_region_validation = true
  subnet_id       = "subnet-0dd033dd7e2cb6071"
  source_ami      = "${var.source_ami}"
  ssh_username    = "${var.ssh_username}"
  
    tags = {
    Author      = "user"
    Environment = "dev"
    Tool        = "Packer"
  }
}

 

build {
  sources = ["source.amazon-ebs.amiwebapp"]

  provisioner "shell" {
    environment_vars = ["FOO=foo"]
    script           = "script1.sh"
  }

  

  provisioner "file" {
    source      = "./"
    destination = "/home/ubuntu/webapp"
  }

  

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    scripts = [
      "shell.sh"
    ]
  }



}
