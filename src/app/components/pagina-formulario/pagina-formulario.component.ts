import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Transportadora, TransportadoraAPI } from '../models/transportadora.model';
import { TokenResponse } from '../models/token-response.model';
import { TokenError } from '../models/token-error.model';
import { RespostaApi } from '../models/resposta-api.model';
import { RespostaApiGenerica } from '../models/respota-api-generica.model';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pagina-formulario',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  templateUrl: './pagina-formulario.component.html',
  styleUrl: './pagina-formulario.component.css',
})
export class PaginaFormularioComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  cnpj = new FormControl('');
  nome = new FormControl('');
  email = new FormControl('');

  transportadoraValue: Transportadora = {
    cnpj: this.cnpj.value ?? '',
    nome: this.nome.value ?? '',
    email: this.email.value ?? '',
  };

  //Dados Para Autenticação no Protheus
  private usuario: string = 'wenderson.farias';
  private senha: string = 'wenderson1@A';
  private bearerToken: string = '';

  baseHeaders = new HttpHeaders()
    .set('Authorization', `Bearer ${this.bearerToken}`)
    .set('Content-Type', 'application/json');

  ngOnInit(): void {
    console.log('Página de Formulário Inicializada');
    this.authService.login().subscribe({
      next: (res) => {
        this.authService.setTokens(res.access_token, res.refresh_token);
        console.log('Token inicial carregado');
      },
      error: (err) => {
        const apiError = err.error as TokenError;
        console.log('Erro Código:', apiError.code);
        console.log('Erro Mensagem:', apiError.message);
        console.log('Erro Detalhe:', apiError.detailMessage);
        this.snackBar.open(`${apiError.message}`, 'OK', {
          duration: 3000,
        });
      },
    });
  }

  validCNPJInput(): void {
    if (this.cnpj.value?.trim() != '') {
      this.nome.setValue('');
      this.email.setValue('');

      this.http
        .get<TransportadoraAPI>(
          'http://192.168.200.225:9900/rest/WSTransport/transportadora/get_id',
          {
            params: { id: this.cnpj.value ?? '' },
          },
        )
        .subscribe({
          next: (res) => {
            this.snackBar.open('Transportadora carregada!', 'OK', {
              duration: 5000,
            });
            this.mapTransportadora(res);
          },
          error: (err) => {
            if (err.code === 400) {
              console.log('Erro 400: Requisição inválida' + err.message);
              const respostaApiError = err.error as RespostaApi;
              console.log('Erro ID:', respostaApiError.errorId);
              console.log('Erro:', respostaApiError.error);
              console.log('Solução:', respostaApiError.solution);
              this.snackBar.open(`${respostaApiError.error}`, 'OK', {
                duration: 3000,
              });
            } else if (err.code === 401) {
              const errorAuth = err.error as RespostaApiGenerica;
              console.log('Erro de Autenticação:', errorAuth.message);
              this.snackBar.open(`${errorAuth.message}`, 'OK', {
                duration: 3000,
              });
            }
          },
        });
    }
  }

  ClickAoConfirmar(): void {
    this.http
      .post<RespostaApiGenerica>(
        'http://192.168.200.225:9900/rest/WSTransport/transportadora',
        this.preencherTransportadora(), //body da requisição com os dados da transportadora
        {
          params: { id: this.cnpj.value ?? '' },
        },
      )
      .subscribe({
        next: (res: RespostaApiGenerica) => {
          console.log('Resposta da API:', res.message);
          this.snackBar.open(`${res.message}`, 'OK', {
            duration: 3000,
          });
          this.LimparCampos();
        },
        error: (err) => {
          if (err.code === 400) {
            console.log('Erro 400: Requisição inválida' + err.message);
            const respostaApiError = err.error as RespostaApi;
            console.log('Erro ID:', respostaApiError.errorId);
            console.log('Erro:', respostaApiError.error);
            console.log('Solução:', respostaApiError.solution);
            this.snackBar.open(`${respostaApiError.error}`, 'OK', {
              duration: 3000,
            });
          } else if (err.code === 401) {
            const errorAuth = err.error as RespostaApiGenerica;
            console.log('Erro de Autenticação:', errorAuth.message);
            this.snackBar.open(`${errorAuth.message}`, 'OK', {
              duration: 3000,
            });
          }
        },
      });

    //Preenchendo o objeto transportadoraValue com os valores dos campos do formulário
    this.transportadoraValue.cnpj = this.cnpj.value ?? '';
    this.transportadoraValue.nome = this.nome.value ?? '';
    this.transportadoraValue.email = this.email.value ?? '';
  }

  ClickAoLimpar(): void {
    this.LimparCampos();
  }

  private mapTransportadora(api: TransportadoraAPI) {
    (this.cnpj.setValue(api.cgc?.trim() || ''),
      this.nome.setValue(api.nome?.trim() || ''),
      this.email.setValue(api.email?.trim() || ''));
  }

  private preencherTransportadora(): TransportadoraAPI {
    const transportadoraAPI: TransportadoraAPI = {
      cgc: this.cnpj.value ?? '',
      nome: this.nome.value ?? '',
      email: this.email.value ?? '',
    };
    return transportadoraAPI;
  }

  LimparCampos(): void {
    this.cnpj.setValue('');
    this.nome.setValue('');
    this.email.setValue('');
  }
}
