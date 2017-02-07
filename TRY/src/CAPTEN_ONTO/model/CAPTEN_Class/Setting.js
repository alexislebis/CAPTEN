
function Setting(){
  CAPTENClass.call(this);

  this.scientificeStatement = null;
}

Setting.prototype = Object.create(CAPTENClass.prototype);

function SettingInputRGTE(){
  Setting.call(this);

}

SettingInputRGTE.prototype = Object.create(Setting.prototype);

function SettingParameter(){
  Setting.call(this);

  this.value = null;
}
SettingParameter.prototype = Object.create(Setting.prototype);
