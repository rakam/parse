/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */
'use strict';

var app = app || {};

(function () {
	'use strict';

	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;

	app.TodoItem = React.createClass({
		displayName: 'TodoItem',

		handleSubmit: function handleSubmit(event) {
			var val = this.state.editText.trim();
			if (val) {
				this.props.onSave(val);
				this.setState({ editText: val });
			} else {
				this.props.onDestroy();
			}
		},

		handleEdit: function handleEdit() {
			this.props.onEdit();
			this.setState({ editText: this.props.todo.get('title') });
		},

		handleKeyDown: function handleKeyDown(event) {
			if (event.which === ESCAPE_KEY) {
				this.setState({ editText: this.props.todo.get('title') });
				this.props.onCancel(event);
			} else if (event.which === ENTER_KEY) {
				this.handleSubmit(event);
			}
		},

		handleChange: function handleChange(event) {
			this.setState({ editText: event.target.value });
		},

		getInitialState: function getInitialState() {
			return { editText: this.props.todo.get('title') };
		},

		/**
   * Safely manipulate the DOM after updating the state when invoking
   * `this.props.onEdit()` in the `handleEdit` method above.
   * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
   * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
   */
		componentDidUpdate: function componentDidUpdate(prevProps) {
			if (!prevProps.editing && this.props.editing) {
				var node = React.findDOMNode(this.refs.editField);
				node.focus();
				node.setSelectionRange(node.value.length, node.value.length);
			}
		},

		render: function render() {
			return React.createElement(
				'li',
				{ className: React.addons.classSet({
						completed: this.props.todo.get('completed'),
						editing: this.props.editing
					}) },
				React.createElement(
					'div',
					{ className: 'view' },
					React.createElement('input', {
						className: 'toggle',
						type: 'checkbox',
						checked: this.props.todo.get('completed'),
						onChange: this.props.onToggle
					}),
					React.createElement(
						'label',
						{ onDoubleClick: this.handleEdit },
						this.props.todo.get('title')
					),
					React.createElement('button', { className: 'destroy', onClick: this.props.onDestroy })
				),
				React.createElement('input', {
					ref: 'editField',
					className: 'edit',
					value: this.state.editText,
					onBlur: this.handleSubmit,
					onChange: this.handleChange,
					onKeyDown: this.handleKeyDown
				})
			);
		}
	});
})();