import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-update',
  templateUrl: './cliente-update.component.html',
  styleUrls: ['./cliente-update.component.css']
})
export class ClienteUpdateComponent {

  constructor(
    private service: ClienteService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  cliente: Cliente = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dataCriacao: ''
  }

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  senha: FormControl = new FormControl(null, Validators.minLength(3));

  perfilTemp: any[] = [];

  ngOnInit(): void {
    this.cliente.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.cliente.id).subscribe(resposta => {
      //console.log(resposta.perfis);
      this.armazenaPerfil(resposta.perfis);
      resposta.perfis = [];
      this.cliente = resposta;
      this.cliente.perfis = this.perfilTemp;
      //console.log(this.cliente);
    })
  }

  update(): void {
    this.service.update(this.cliente).subscribe(() => {
      this.toast.success('Cliente atualizado com sucesso', 'Atualização');
      this.router.navigate(['clientes'])
    }, ex => {
      //console.log(ex);
      if (ex.error.errors) {
        ex.error.errors.forEach(element => {
          this.toast.error(element.message);
        });
      } else {
        this.toast.error(ex.error.message);
      }
    })
  }

  addPerfil(perfil: any): void {
    if (this.cliente.perfis.includes(perfil)) {
      this.cliente.perfis.splice(this.cliente.perfis.indexOf(perfil), 1);
    } else {
      this.cliente.perfis.push(perfil);
    }
    //console.log(this.cliente.perfis);
  }

  armazenaPerfil(perfil: any) {
    this.perfilTemp = [];
    for (const item of perfil) {
      //console.log(item);
      if (item == "ADMIN") {
        this.perfilTemp.push(0);
      }else if (item == "CLIENTE") {
        this.perfilTemp.push(1);
      }else if (item == "TECNICO") {
        this.perfilTemp.push(2);
      }
    }
    //console.log(this.perfilTemp);
  }

  verificaPerfilAdmin(perfil: any): boolean {
    for (const item of perfil) {
      //console.log(item);
      if (item == "0") {
        return true;
      }
    }
    return false;
  }

  verificaPerfilCliente(perfil: any): boolean {
    for (const item of perfil) {
      //console.log(item);
      if (item == "1") {
        return true;
      }
    }
    return false;
  }

  verificaPerfilTecnico(perfil: any): boolean {
    for (const item of perfil) {
      //console.log(item);
      if (item == "2") {
        return true;
      }
    }
    return false;
  }

  validaCampos(): boolean {
    return this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid;
  }

}
