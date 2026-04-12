import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';

import { Transportadora } from '../../Transportadora';

@Component({
  selector: 'app-pagina-formulario',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule
  ],
  templateUrl: './pagina-formulario.component.html',
  styleUrl: './pagina-formulario.component.css'
})
export class PaginaFormularioComponent {

  transportadoraValue: Transportadora = {
    cnpj: '',
    nome: '',
    email: ''
  };

  cnpj = new FormControl('');
  nome = new FormControl('');
  email = new FormControl('');

  validCNPJInput(): void{
    console.log(this.cnpj.value);
    console.log(this.nome.value);

  }

  ClickAoConfirmar(): void{
    
    alert("CNPJ: " + this.cnpj.value + "\nNome: " + this.nome.value + "\nEmail: " + this.email.value);
    
    //Preenchendo o objeto transportadoraValue com os valores dos campos do formulário
    this.transportadoraValue.cnpj = this.cnpj.value ?? '';
    this.transportadoraValue.nome = this.nome.value ?? '';
    this.transportadoraValue.email = this.email.value ?? '';
    
    console.table(this.transportadoraValue);
  }

  ClickAoLimpar(): void{
    this.cnpj.setValue('');
    this.nome.setValue('');
    this.email.setValue('');
  }

}
