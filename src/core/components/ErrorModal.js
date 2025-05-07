// Error Modal Component and Logic
export const ErrorModalStyles = `
  .ee-error-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: auto;
  }

  .ee-error-content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .ee-error-content h3 {
    margin: 0 0 15px 0;
    color: #e74c3c;
    font-size: 24px;
  }

  .ee-error-content p {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 16px;
    line-height: 1.5;
  }

  .ee-error-note {
    font-size: 14px;
    color: #666;
    font-style: italic;
  }

  .ee-error-close {
    background: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.2s;
  }

  .ee-error-close:hover {
    background: #2980b9;
  }
`;

export const ErrorModalComponent = {
  template: `
    <div v-if="show" class="ee-error-modal">
      <div class="ee-error-content">
        <h3>Oops! Something went wrong</h3>
        <p>{{ message }}</p>
        <p class="ee-error-note">Don't worry, our team has been notified and we're working on it.</p>
        <button @click="close" class="ee-error-close">Close</button>
      </div>
    </div>
  `,
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};

export class ErrorHandler {
  constructor(app) {
    this.app = app;
    this.errorModal = {
      show: false,
      message: "",
      eggId: null,
    };
  }

  showError(eggId, errorType, error, context = {}) {
    this.errorModal = {
      show: true,
      message: this.getErrorMessage(errorType, eggId),
      eggId: eggId,
    };
    this.updateAppData();
  }

  closeError() {
    this.errorModal.show = false;
    this.updateAppData();
  }

  updateAppData() {
    if (this.app._instance && this.app._instance.data) {
      this.app._instance.data.errorModal = this.errorModal;
    }
  }

  getErrorMessage(errorType, eggId) {
    const egg = this.app.eggs.get(eggId);
    const eggName = egg ? egg.name : eggId;

    switch (errorType) {
      case "assetLoadError":
        return `We're having trouble loading some content for the "${eggName}" Easter egg.`;
      case "renderError":
        return `Something went wrong while displaying the "${eggName}" Easter egg.`;
      case "networkError":
        return `We're having trouble connecting to the server for the "${eggName}" Easter egg.`;
      default:
        return `An unexpected error occurred with the "${eggName}" Easter egg.`;
    }
  }
}
