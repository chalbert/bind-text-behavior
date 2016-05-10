import registerBehavior from 'register-behavior';
import dispatchDataRequest from 'dispatch-data-request';
import resolveData from 'resolve-data';

export default registerBehavior('bind-text', {
	prototype: {
		attachedCallback() {
			this.handleDataChange = this.handleDataChange.bind(this);

			this.descriptor = this.target.getAttribute('bind-text');
			dispatchDataRequest(this.target, this.descriptor, true).then(dataRequest => {
				if (!this.detached) {
					this.updateText(dataRequest.value);

					this.source = dataRequest.source;
					this.source.addEventListener('datachange', this.handleDataChange);
				}
			});
		},

		detachedCallback() {
			this.detached = true;

			if (this.source) {
				this.source.removeEventListener('datachange', this.handleDataChange);
			}
		},

		updateText(text) {
			if (this.target.formatter) {
				text = this.target.formatter(text);
			}

			if (text === null || typeof text === 'undefined') {
				text = '';
			}

			this.target.textContent = text;
		},

		handleDataChange(event) {
			let { value } = resolveData(this.source.model, this.descriptor);
			this.updateText(value)
		}
	}
});
