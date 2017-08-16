class Form {
	constructor () {
		this.btnOpenReg     = document.getElementsByClassName('register')[0];
		this.btnCloseReg    = document.getElementsByClassName('if_back')[0];
		this.firstForm      = document.getElementsByClassName('input_form_wrap')[0];
		this.secondForm     = document.getElementsByClassName('input_form_wrap')[1];
		this.successMsg     = document.getElementsByClassName('email_created')[0];

		var __this = this;
	}

	openReg () {
		var __this = this;
		// __this.secondForm.style.display = 'block';
		__this.firstForm.classList.add('hide_block');
		__this.firstForm.classList.remove('show_block');
		setTimeout(function () {
			__this.firstForm.style.display = 'none';
			__this.secondForm.style.display = 'block';
		}, 400);
		setTimeout(function () {
			__this.secondForm.classList.add('show_block');
		}, 600);
	}

	closeReg () {
		var __this = this;
		__this.secondForm.classList.add('hide_block');
		__this.secondForm.classList.remove('show_block');
		setTimeout(function () { __this.firstForm.style.display = 'block'; }, 400);
		setTimeout(function () {
			__this.firstForm.classList.add('show_block');
			__this.secondForm.style.display = 'none';
		}, 600);
	}

	addHandler(object, event, handler, useCapture) {
		if (object.addEventListener) {
			object.addEventListener(event, handler, useCapture ? useCapture : false);
		} else if (object.attachEvent) {
			object.attachEvent('on' + event, handler);
		} else alert("Add handler is not supported");
	}
}

class LogForm extends Form {
	constructor () {
		super();
		this.userEmail  = document.querySelectorAll('input[name="email_log"]')[0];
		this.userPass   = document.querySelectorAll('input[name="pass_log"]')[0];
		this.logInBtn   = document.getElementsByClassName('if_submit_log')[0];
		this.logErr     = document.getElementsByClassName('error_name_wrap')[0];

		var __this = this;

		this.logInBtn.onclick = function () {
			__this.values           = {};
			__this.values.action    = 'login';
			__this.values.userEmail = __this.userEmail.value.trim();
			__this.values.userPass  = __this.userPass.value.trim();

			__this.checkLogForm() ? __this.logIn() : __this.logErr.style.display = 'block';
		}
	}

	logIn () {
		var ajax = new Ajax;
		var __this = this;

		var ajaxReq = {
			type: 'POST',
			body: this.values
		};
		// !! dev !!
		console.log(ajaxReq.body);
		ajax.sendRequest('http://localhost:3000/login', ajaxReq , function (data) {
			if (data)
				document.location.href = 'http://localhost:3000/profile';
			else
				__this.logErr.style.display = 'block';
			console.log(data ? data : 0);
		});
	}

	checkLogForm () {
		if (this.values.userEmail && this.userEmail.checkValidity() && this.values.userPass) {
			console.log('Login form passed validation');
			return (true);
		} else {
			console.log('Login form didn`t passed  validation');
			return (false);
		}
	}
}

class RegForm extends Form {
	constructor () {
		console.log('reg form created !');
		super();
		this.logform                = {};
		this.logform.userName       = document.querySelectorAll('input[name=\"name_reg\"]')[0];
		this.logform.userSurname    = document.querySelectorAll('input[name=\"first_name_reg\"]')[0];
		this.logform.userEmail      = document.querySelectorAll('input[name=\"email\"]')[0];
		this.logform.userPassword   = document.querySelectorAll('input[name=\"pass_new\"]')[0];
		this.logform.userPasswordRe = document.querySelectorAll('input[name=\"pass_new_re\"]')[0];
		this.regBtnSubmit           = document.getElementsByClassName('if_submit_reg')[0];
		this.uploadAvatarBtn    	= document.getElementsByClassName('click-to-upload-avatar')[0];
		this.uploadAvatar       	= document.querySelector('input[name=upload-user-avatar]');
		this.body 					= [];

		var empty					= false;

		var __this = this;

		__this.addHandler(__this.regBtnSubmit, 'click', function () {
			if (__this.checkPasswords() == 1) {
				for (var key in __this.logform) {
					__this.body[key] = __this.logform[key].value.trim().length > 0 ? __this.logform[key].value.trim() : empty = true;
				}
				!empty && __this.body['img'] ? __this.sendUserData() : console.log('some input empty.');
			}
		});

		this.uploadAvatarBtn.onclick = function () {
			__this.uploadAvatar.click()
		};

		this.uploadAvatar.onchange = function () {
			vueObjects.addUserAvatar.addNewImg();
		};
	}

	sendUserData () {
		var ajax = new Ajax;
		var __this = this;

		var ajaxReq = {
			type: 'POST',
			body: this.body
		};
		// dev
		console.log(ajaxReq.body);
		ajax.sendRequest('http://localhost:3000/login', ajaxReq , function (data) {
			if (data.status == 'added') {
				__this.successMsg.style.display = 'block';
				setTimeout(function () {
					__this.closeReg();
				},5000)
			}
			console.log(data ? data : 0);
		});
	}

	checkPasswords () {
		if (this.logform.userPassword.value != this.logform.userPasswordRe.value) {
			this.logform.userPasswordRe.setCustomValidity("Пароли не совпадают");
			this.logform.userPasswordRe.style.borderBottom = this.logform.userPassword.style.borderBottom = '1px solid red';
			return (0);
		} else if ((this.logform.userPassword.value.length < 5 || this.logform.userPassword.value.length > 20) || (this.logform.userPasswordRe.value.length < 5 || this.logform.userPasswordRe.value.length > 20)){
			this.logform.userPasswordRe.setCustomValidity("Пароль не соотвутствует длине. От 5 - 20 символов.");
			this.logform.userPasswordRe.style.borderBottom = this.logform.userPassword.style.borderBottom = '1px solid red';
			return (0);
		} else {
			this.logform.userPasswordRe.setCustomValidity('');
			this.logform.userPasswordRe.style.borderBottom = this.logform.userPassword.style.borderBottom = '1px solid limegreen';
			return (1);
		}
	}

	addNewImg () {
		var uploadAvatar    = document.querySelector('input[name=upload-user-avatar]');
		this.errMsg         = document.getElementsByClassName('upload-new-avatar-err')[0];
		this.submitBtn      = document.getElementsByClassName('add-avatar-btn')[0];
		this.imgWrap        = document.getElementsByClassName('upload-avatar-img-wrap')[0];
		var file            = uploadAvatar.files[0]; //sames as here
		var reader          = new FileReader();
		var __this          = this;

		if (!file.type.match(/.(jpg|jpeg|png|gif|bmp)$/i)) {
			__this.errMsg.innerText = "It`s not an image!!\nI`m watching you -_-";
			__this.errMsg.setAttribute('style', 'font-size: 1em;');
		}
		else if (file) {
			reader.onloadend = function () {
				__this.errMsg.removeAttribute('style');
				__this.imgWrap.setAttribute('style', 'width: 100%;');
				regForm.body['img'] = __this.photoSrc = reader.result;
				__this.photoName = file.name;

				__this.submitBtn.setAttribute('style', 'display:flex;');
			}
			reader.readAsDataURL(file); //reads the data as a URL
		} else {
			__this.errMsg.innerText = "Some error, try another file";
			__this.errMsg.setAttribute('style', 'font-size: 1em;');
		}
	}
}

var vueObjects = {};

window.onload = function() {
	var form    = new Form;
	var logForm = new LogForm;
	var regForm;

	form.btnOpenReg.onclick = function() {
		console.log(1);
		form.openReg();
		regForm = new RegForm;

	};
	form.btnCloseReg.onclick = function() {
		console.log(2);
		form.closeReg();
		logForm = new LogForm;
	};

	Vue.component('omni-item', {
		props: ['item'],
		template:   '<li class="omni-sign-up clearfix" v-bind:name="item.name">' +
						'<img v-bind:src="item.img">'+
					'</li>'
	});

	var items =  [
		{
			img: 'images/omniauth/google.png',
			name: 'google'
		},
		{
			img: 'images/omniauth/42.png',
			name: 'school42'
		},
		{
			img: 'images/omniauth/fb.png',
			name: 'google'
		}

	];
	vueObjects.omniLog = new Vue ({
		el: document.getElementsByClassName('omni-list-log')[0],
		data: {
			items: items
		}
	});

	vueObjects.omniLog = new Vue ({
		el: document.getElementsByClassName('omni-list-reg')[0],
		data: {
			items: items
		}
	});

	vueObjects.addUserAvatar = new Vue ({
		el: '.avatar-uploading',
		data: {
			photoSrc: '',
			photoName: ''
		},
		methods: {
			addNewImg: function () {
				var uploadAvatar= document.querySelector('input[name=upload-user-avatar]');
				this.errMsg 	= document.getElementsByClassName('upload-new-avatar-err')[0];
				this.submitBtn 	= document.getElementsByClassName('add-avatar-btn')[0];
				this.imgWrap 	= document.getElementsByClassName('upload-avatar-img-wrap')[0];
				var file 		= uploadAvatar.files[0]; //sames as here
				var reader 		= new FileReader();
				var __this 		= this;

				if (!file.type.match(/.(jpg|jpeg|png|gif|bmp)$/i)) {
					__this.errMsg.innerText = "It`s not an image!!\nI`m watching you -_-";
					__this.errMsg.setAttribute('style', 'font-size: 1em;');
				}
				else if (file) {
					reader.onloadend = function () {
						__this.errMsg.removeAttribute('style');
						__this.imgWrap.setAttribute('style', 'width: 100%;');
						console.log('check!!!', regForm);
						regForm.body['img'] = __this.photoSrc = reader.result;
						__this.photoName = file.name;

					}
					reader.readAsDataURL(file); //reads the data as a URL
				} else {
					__this.errMsg.innerText = "Some error, try another file";
					__this.errMsg.setAttribute('style', 'font-size: 1em;');
				}
			},
		}
	});

}