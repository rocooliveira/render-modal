# Render Modal
Classe JavaScript para gerenciar modais Bootstrap 5.  
Permite criar, personalizar e controlar modais com facilidade.


# Render Modal
Classe JavaScript para gerenciar modais Bootstrap 5.  
Permite criar, personalizar e controlar modais com facilidade.

## 📦 Instalação

Você pode usar diretamente via CDN (com jsDelivr) ou baixar para seu projeto:

```html
<!-- Inclua Bootstrap 5 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/gh/rocooliveira/render-modal@1.0.0/render-modal.js"></script>
```
ou
```html
<!-- Inclua Bootstrap 5 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="render-modal.js"></script>
```

Para utilizar com import no seu projeto use a versão umd (prefixo .umd.js)
```html
<script src="https://cdn.jsdelivr.net/gh/rocooliveira/render-modal@1.0.0/render-modal.umd.min.js"></script>
```
------------


## ⚙️ Métodos disponíveis
- render(props, caller?): Cria e exibe uma nova modal. Retorna uma Promise.

- confirm(callback, loading?): Define a função chamada no clique do botão "Confirmar".

- cancel(callback): Define função para o clique em "Cancelar".

- setContent(html): Substitui o conteúdo da modal dinamicamente.

- loading(true|false): Exibe/oculta spinner de carregamento no botão "Confirmar".

- close(): Fecha a modal manualmente.

- onRender(): Retorna uma Promise que resolve quando a modal for exibida.

- onClose(): Retorna uma Promise que resolve quando a modal for fechada.

- element(selector?): Acessa a modal diretamente ou algum seletor interno.

- clear(): Limpa o conteúdo da modal.


------------

## ✨ Exemplo com carregamento assíncrono

```js
const modal = new renderModal();

modal.render({ title: 'Enviando dados', body: '{{loading}} Processando...' });

modal.confirm(async () => {
  await fetch('/api/enviar', { method: 'POST' });
  modal.close();
}, true);
```

```js

modal.render({ title: 'Carregando...' }).then(async () => {
  modal.loading(true);
  await fetch('/api/acao');
  modal.loading(false);
});


```

------------


## ⚙️ Configurações disponíveis
| Propriedade        | Tipo                                   | Descrição                                                        |
| ------------------ | -------------------------------------- | ---------------------------------------------------------------- |
| `title`            | `string`                               | Título da modal                                                  |
| `body`             | `string`                               | HTML do corpo da modal                                           |
| `backdrop`         | `boolean` ou `string`                  | Controla o backdrop (`true`, `false`, `'static'`)                |
| `btnConfirmCancel` | `boolean` ou `string[]`                | Exibe botões Confirmar/Cancelar ou define rótulos personalizados |
| `customHeader`     | `string`                               | HTML personalizado para o cabeçalho                              |
| `customFooter`     | `string`                               | HTML personalizado para o rodapé                                 |
| `footerActions`    | `boolean`                              | Exibir ações no rodapé                                           |
| `fontWeight`       | `'normal'`, `'bold'` etc.              | Peso da fonte do corpo                                           |
| `alignBody`        | `'start'`, `'center'`, `'end'`         | Alinhamento do corpo                                             |
| `size`             | `'sm'`, `'lg'`, `'xl'`, `'fullscreen'` | Tamanho da modal                                                 |
| `scrollable`       | `boolean`                              | Se o corpo é rolável                                             |
| `centered`         | `boolean`                              | Alinha verticalmente no centro                                   |
| `alignEnd`         | `boolean`                              | Alinha ao final da tela                                          |
| `verticalPadding`  | `number`                               | Padding vertical do corpo                                        |
| `modalClass`       | `string`                               | Classe CSS extra para a modal                                    |
| `extraButton`      | `string`                               | HTML de botão adicional no rodapé                                |


------------


