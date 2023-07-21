import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css']
})
export class TecnicoUpdateComponent {

  constructor(
    private service: TecnicoService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  tecnico: Tecnico = {
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
    this.tecnico.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe(resposta => {
      //console.log(resposta.perfis);
      this.armazenaPerfil(resposta.perfis);
      resposta.perfis = [];
      this.tecnico = resposta;
      this.tecnico.perfis = this.perfilTemp;
      //console.log(this.tecnico);
    })
  }

  update(): void {
    this.service.update(this.tecnico).subscribe(() => {
      this.toast.success('Técnico atualizado com sucesso', 'Atualização');
      this.router.navigate(['tecnicos'])
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
    if (this.tecnico.perfis.includes(perfil)) {
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil), 1);
    } else {
      this.tecnico.perfis.push(perfil);
    }
    //console.log(this.tecnico.perfis);
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
