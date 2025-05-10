'use strict';
/**
 * @name renderModal
 * @description Classe para gerenciar modais Bootstrap.
 * @version 1.0.0
 * @author Rômulo Costa <rocooliveira@outlook.com>
 * @license MIT
 * @repository https://github.com/rocooliveira/renderModal
 *
 * Criado para facilitar a criação e controle de modais utilizando Bootstrap 5,
 * com recursos como carregamento assíncrono, personalização de rodapé e callbacks.
 *
 */
class renderModal {

  #handles = {};

  /**
   * Cria uma instância do gerenciador de modais
   * @param {Object} defaults - Configurações padrão para todas as modais
   */
  constructor(defaults = {}) {
    // Configurações padrão que podem ser modificadas globalmente
    this.defaults = {
      title: '', // Título exibido no header. Padrão em branco
      backdrop: true,
      btnConfirmCancel: true,
      customHandle: true,
      closeToDone: true,
      footerActions: true,
      fontWeight: 'normal',
      alignBody: 'start',
      size: '',
      scrollable: false,
      centered: false,
      alignEnd: false,
      verticalPadding: 3,
      modalClass: '',
      extraButton: '',
      // Sobrescreve com quaisquer configurações personalizadas
      ...defaults
    };


    // Adiciona ouvinte de eventos global para botões de cancelar e dismiss
    this._setupGlobalEventListeners();
  }

  /**
   * Configura ouvintes de eventos globais
   * @private
   */
  _setupGlobalEventListeners() {
    // Adiciona ouvinte para botões de cancelar e dismiss
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('modal-cancel') || event.target.classList.contains('modal-dismiss')) {
        // Primeiro remove o foco do botão
        event.target.blur();
        
        // Depois fecha a modal
        const modal = event.target.closest('.generic-modal');
        if (modal) {
          const bsModal = bootstrap.Modal.getInstance(modal);
          if (bsModal) bsModal.hide();
        }
      }
    });
  }

  element(el = null) {
    if (el) {
      return this.#handles.dialog.querySelector(el);
    }
    return this.#handles.dialog;
  }

  setContent(html) {
    this.#handles.dialog.querySelector('.modal-main-content').innerHTML = html;
  }

  loading(status = true) {
    const spinner = `<div class="spinner-border spinner-border-sm text-secondary me-auto"></div>`;
    const confirmBtn = this.#handles.dialog.querySelector('.modal-confirm');
    const footer = this.#handles.dialog.querySelector('.modal-footer');
    
    if (status === true) {
      if (confirmBtn) confirmBtn.disabled = true;
      
      // Adiciona spinner se ainda não estiver presente
      if (!footer.querySelector('.spinner-border')) {
        const spinnerDiv = document.createElement('div');
        spinnerDiv.innerHTML = spinner.trim();
        footer.prepend(spinnerDiv.firstChild);
      }
    } else {
      if (confirmBtn) confirmBtn.disabled = false;
      
      // Remove spinner
      const existingSpinner = footer.querySelector('.spinner-border');
      if (existingSpinner) existingSpinner.remove();
    }
  }

  clear() {
    this.#handles.dialog.querySelector('.modal-main-content').innerHTML = '';
  }


  confirm(fn, loading = null) {
    const confirmBtn = this.#handles.dialog.querySelector('.modal-confirm');
    if (!confirmBtn) return;
    
    confirmBtn.addEventListener('click', async () => {
      // Garante que o botão perca o foco para evitar problemas
      confirmBtn.blur();
      
      const useLoading = ((loading !== false && fn.constructor.name === 'AsyncFunction') || loading === true);
      
      if (useLoading) {
        this.loading(true);
        await fn();
        this.loading(false);
        return;
      }
      
      fn();
    });
    
    return confirmBtn;
  }
  cancel(callback) {
    const cancelBtn = this.#handles.dialog.querySelector('.modal-cancel');
    if (!cancelBtn) return;
    
    if (typeof callback === 'function') {
      cancelBtn.addEventListener('click', callback);
    }
    
    return cancelBtn;
  }

  
  onRender() {

   const dialog = this.#handles.dialog;

   const awaitModal = (method) => { console.log('teste')
      if (dialog.classList.contains('show')) {
        method();
      } else {
        setTimeout(function() { awaitModal(method); }, 300);
      }
    };

    return new Promise(function(resolve) {
      awaitModal(function() {
        resolve(true);
      });
    });
  }

  onClose() {
    return new Promise(function(resolve) {
      this.#handles.dialog.addEventListener('hidden.bs.modal', function handler() {
        this.#handles.dialog.removeEventListener('hidden.bs.modal', handler);
        resolve(true);
      });
    });
  }

  close() {
    const bsModal = bootstrap.Modal.getInstance(this.#handles.dialog);
    if (bsModal) bsModal.hide();
  }

  /**
   * Cria e exibe uma modal
   * @param {Object|string} props - Propriedades da modal ou conteúdo do corpo
   * @param {Object} caller - Objeto de chamada (opcional)
   * @returns {Promise} - Promise com métodos adicionais para manipular a modal
   */
  render(props = {}, caller = {}) {
    // Se props for uma string, consideramos como conteúdo do corpo
    if (typeof props === 'string') {
      props = { body: props };
    }

    // Mescla configurações padrão com as propriedades passadas
    const config = { ...this.defaults, ...props };
    
    // Extrai propriedades específicas
    let {
      id,
      title,
      body,
      backdrop,
      btnConfirmCancel,
      customHeader,
      noHeader,
      customFooter,
      footerActions,
      closeToDone,
      rmConfirmWhenDone,
      customHandle,
      extraButton,
      fontWeight,
      alignBody,
      size,
      scrollable,
      centered,
      alignEnd,
      verticalPadding,
      modalClass,
    } = config;

    const modalId = (id) ? `id="${id}"` : '';
    const classRef = `modal-ref-${Date.now()}`;
    
    let modalTitle = title;
    let modalBody = body || '';
    let btnCancel = (Array.isArray(btnConfirmCancel)) ? btnConfirmCancel[0] : 'Cancelar';
    let btnConfirm = (Array.isArray(btnConfirmCancel)) ? btnConfirmCancel[1] : 'Confirmar';
    let buttons = '';
    let modalDialogStyle = '';

    // Trata classes de tamanho
    switch (size) {
      case 'sm':
        size = 'modal-sm';
        break;
      case 'lg':
        size = 'modal-lg';
        break;
      case 'xl':
        size = 'modal-xl';
        break;
      case 'full':
      case 'fullscreen':
        size = 'modal-fullscreen';
        break;
      default:
        size = '';
        break;
    }

    // Trata classes adicionais
    let scrollableClass = (scrollable) ? 'modal-dialog-scrollable' : '';
    let centeredClass = (centered) ? 'modal-dialog-centered' : '';

    // Cria botões do rodapé
    if (footerActions) {
      if (btnConfirmCancel) {
        buttons = `<button class="modal-cancel btn btn-secondary modal-dismiss">${btnCancel}</button>
        <button class="modal-confirm btn btn-primary">${btnConfirm}</button>`;
      } else {
        buttons = `<button class="modal-ok btn btn-secondary px-4 modal-dismiss"> Ok </button>`;
      }
    }

    // Trata botão extra
    if (extraButton) {
      extraButton = `<div class="col">${extraButton}</div>`;
    }

    // Estilo do cabeçalho
    let headerStyle = (title !== '') ? '' : 'style="padding:0.70rem 1rem;"';

    // Trata alinhamento
    if (alignEnd) {
      modalDialogStyle = 'display:flex; align-items:end; min-height: 93%;';
    }

    // Cria cabeçalho da modal
    const modalHeader = (noHeader) 
      ? '' 
      : (customHeader)
        ? `<div class="modal-header">${customHeader}</div>`
        : `<div class="modal-header" ${headerStyle}>
            <h5 class="modal-title">${modalTitle}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>`;

    // Trata placeholders de carregamento
    if (modalBody.includes('{{loading}}')) {
      const spinner = '<div class="spinner-border spinner-border-sm text-secondary my-auto"></div>';
      modalBody = modalBody.replace(/{{loading}}/g, spinner);
    }

    // Cria rodapé da modal
    const modalFooter = customFooter
      ? `<div class="modal-footer">${customFooter}</div>`
      : `<div class="modal-footer ${!footerActions ? 'd-none' : ''}">
          ${extraButton}
          ${buttons}
        </div>`;

    // Cria HTML da modal
    const modalHTML = `
      <div 
        ${modalId}
        class="generic-modal modal fade ${classRef} ${modalClass}"
        tabindex="-1"
        role="dialog"
        data-bs-backdrop="${backdrop}"
      >
        <div 
          class="modal-dialog ${size} ${scrollableClass} ${centeredClass}" 
          role="dialog" 
          style="${modalDialogStyle}"
        >
          <div class="modal-content">
            ${modalHeader}
            <div class="modal-body py-${verticalPadding}">
              <div 
                class="modal-main-content h-100 pt-2 pb-1 text-${alignBody} fw-${fontWeight}"
              >
                ${modalBody}
              </div>  
            </div>
            ${modalFooter}
          </div>
        </div>
      </div>
    `;

    // Cria um elemento temporário para conter o HTML da modal
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML.trim();
    
    // Obtém o elemento da modal
    this.#handles.dialog = tempDiv.firstChild;

    // Cria objeto deferred equivalente
    let resolvePromise, rejectPromise;
    const promise = new Promise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });


    // Configura listners de eventos para ações do rodapé
    if (footerActions) {
      if (btnConfirmCancel) {
        const cancelBtn = this.#handles.dialog.querySelector('.modal-cancel');
        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => {
            rejectPromise();
          });
        }

        if (!customHandle) {
          const confirmBtn = this.#handles.dialog.querySelector('.modal-confirm');
          if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
              resolvePromise(caller);
            });
          }
        }
      } else {
        const okBtn = this.#handles.dialog.querySelector('.modal-ok');
        if (okBtn) {
          okBtn.addEventListener('click', () => {
            resolvePromise();
          });
        }
      }
    }

    // Encontra modal anterior (se houver)
    const previousModal = document.querySelector('.generic-modal:last-child');

    // Adiciona a modal ao body
    document.body.appendChild(this.#handles.dialog);

    // Inicializa modal Bootstrap
    const bsModal = new bootstrap.Modal(this.#handles.dialog, {
      backdrop: backdrop
    });
    
    // Exibe a modal
    bsModal.show();

    // Trata z-index para múltiplas modais
    if (previousModal) {
      const computedStyle = window.getComputedStyle(previousModal);
      const modalZindex = parseInt(computedStyle.zIndex) + 1;
      const backDropZindex = modalZindex - 1;

      this.#handles.dialog.style.zIndex = modalZindex;
      
      this.#handles.dialog.addEventListener('shown.bs.modal', function() {
        const backdrop = document.querySelector('.modal-backdrop:last-child');
        if (backdrop) {
          backdrop.style.zIndex = backDropZindex;
        }
      });
    }

    // Gerencia limpeza da modal ao fechar
    this.#handles.dialog.addEventListener('hide.bs.modal', function(e) {
      // Move o foco para fora da modal antes de ocultá-la
      document.body.focus();
      
      // Ou move o foco para o primeiro elemento focável fora da modal
      setTimeout(() => {
        const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        for (const element of focusableElements) {
          // Verifica se o elemento é visível e não está dentro de uma modal
          if (element.offsetParent !== null && !element.closest('.modal')) {
            element.focus();
            break;
          }
        }
      }, 0);
    });
    
    this.#handles.dialog.addEventListener('hidden.bs.modal', function(e) {
      this.remove();
    });


    // Configura resolução de promise para closeToDone
    promise.then(() => {
      // Remove o foco de qualquer elemento ativo na modal
      const activeElement = document.activeElement;
      if (activeElement && this.#handles.dialog.contains(activeElement)) {
        activeElement.blur();
      }
      
      if (rmConfirmWhenDone) {
        const confirmBtn = this.#handles.dialog.querySelector('.modal-confirm');
        const cancelBtn = this.#handles.dialog.querySelector('.modal-cancel');
        
        if (confirmBtn) {
          confirmBtn.parentElement.remove();
        }
        
        if (cancelBtn) {
          cancelBtn.textContent = 'Fechar';
          if (cancelBtn.parentElement) {
            cancelBtn.parentElement.classList = 'col-md-12 col-xs-12 d-block';
          }
        }
      }

      if (closeToDone) {
        // Define timeout para garantir que operações relacionadas ao foco terminem primeiro
        setTimeout(() => {
          this.close();
        }, 0);
      }
    }).catch(() => {
      // Remove o foco de qualquer elemento ativo na modal
      const activeElement = document.activeElement;
      if (activeElement && this.#handles.dialog.contains(activeElement)) {
        activeElement.blur();
      }
      
      // Define timeout para garantir que operações relacionadas ao foco terminem primeiro
      setTimeout(() => {
        this.close();
      }, 0);
    });

    return promise;

  }

  /**
   * Exibe uma modal de erro
   * @param {string} errorMessage - Mensagem de erro
   * @param {string} title - Título da modal de erro
   */
  error(
    errorMessage = '',
    title = '<i class="fas fa-exclamation-triangle"></i> Algo Errado'
  ) {
    if (!errorMessage) errorMessage = 'Não foi possível concluir a solicitação';

    errorMessage = String(errorMessage).replaceAll('\n', '<br>');

    const id = 'modalError_' + String(Date.now()).toString().substr(8, 5);
    this.render({id, title, body: errorMessage, btnConfirmCancel: false});

    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modalContent = modalElement.querySelector('.modal-content');
      const modalTitle = modalElement.querySelector('.modal-title');
      
      if (modalContent) modalContent.style.border = '2px solid #801414';
      if (modalTitle) modalTitle.style.color = '#801414';
    }
  }

  /**
   * Atualiza uma modal existente com estilo e mensagem de erro
   * @param {string} message - Mensagem de erro
   * @param {string} title - Título opcional
   * @param {string} modalRef - Referência da modal para seleção
   */
  errorResponse(message = 'Não foi possível concluir a solicitação', title = '', modalRef = '') {
    const modalMainContent = document.querySelector('.modal-main-content');
    if (!modalMainContent) return;

    if (title) {
      title = `${title} <br>`;
    }

    // Seleciona elementos usando modalRef
    const selector = modalRef ? `.generic-modal${modalRef}` : '.generic-modal';
    const modalContent = document.querySelector(`${selector} .modal-content`);
    const modalHeader = document.querySelector(`${selector} .modal-header`);
    const mainContent = document.querySelector(`${modalRef ? modalRef : ''}.modal-main-content`);
    const confirmBtn = document.querySelector(`${modalRef ? modalRef : ''}.modal-confirm`);
    const cancelBtn = document.querySelector(`${modalRef ? modalRef : ''}.modal-cancel`);
    const spinner = document.querySelector(`${selector} .modal-footer .spinner-border`);

    if (modalContent) modalContent.style.border = '2px solid #801414';
    if (modalHeader) modalHeader.style.color = '#801414';
    if (mainContent) mainContent.innerHTML = `<div class="py-3"><b class="fts-2">${title}</b>${message}</div>`;
    
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.style.border = '1px solid #4db7fe';
    }
    
    document.body.classList.remove('modal-open');
    
    if (cancelBtn) {
      cancelBtn.textContent = 'Fechar';
      cancelBtn.addEventListener('click', function() {
        const modals = document.querySelectorAll('.generic-modal');
        modals.forEach(modal => {
          const bsModal = bootstrap.Modal.getInstance(modal);
          if (bsModal) bsModal.hide();
        });
      });
    }

    if (spinner) spinner.style.display = 'none';
  }
}
