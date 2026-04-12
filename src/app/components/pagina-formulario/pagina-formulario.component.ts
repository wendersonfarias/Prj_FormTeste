import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
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

  cnpj = new FormControl('');
  nome = new FormControl('');
  email = new FormControl('');

  validCNPJInput(): void{
    console.log(this.cnpj.value);
    console.log(this.nome.value);

  }

  ClickAoConfirmar(): void{
    console.log(this.cnpj.value);
    console.log(this.nome.value);
    console.log(this.email.value);
    

    //adicionar em um objeto
    const formData = {
      cnpj: this.cnpj.value,
      nome: this.nome.value,
      email: this.email.value
    };
    console.table(formData);

  }

  ClickAoLimpar(): void{
    this.cnpj.setValue('');
    this.nome.setValue('');
    this.email.setValue('');
  }

}
