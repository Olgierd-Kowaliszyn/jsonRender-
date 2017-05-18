//jquery clear

var __jsonRenderFunctionsList = [];

class jsonRender{

    constructor(_json) {

      _json = _json || {};
      this.setJson(_json);

      this.class = {container: "jsonRenderContainer", label: "jsonRenderLabel", inputContainer: "jsonRenderInputContainer", input: "jsonRenderInput",
                    button: "jsonRenderButton", edit: "jsonRenderEdit", number: "jsonRenderNumber", textarea: "jsonRenderTextarea",
                    password: "jsonRenderPassword", submit: "jsonRenderSubmit", title: "jsonRenderTitle", info: "jsonRenderInfo",
                    back: "jsonRenderBack", delete: "jsonRenderDelete", add: "jsonRenderAdd"};
      this.type = {button: "button", edit: "edit", number: "number", textarea: "textarea", solid: "solid", password: "password"};
      this.label = {button: "", edit: "$$name$$:", number: "$$name$$:", textarea: "$$name$$:", password: "$$name$$"};
      this.value = {button: "$$name$$", edit: "$$value$$", number: "$$float$$", textarea: "$$value$$", password: "", submit: "Zatwierdź zmiany",
                    title: "", info: "", back: "Wróć", delete: "X", add: "Dodaj nowy"};
      this.sort = {button: "4", edit: "0", number: "2", textarea: "3", password: "1"};
      this.visiblity = {button: "true", edit: "true", number: "true", textarea: "true", password: "true"};
      this.goto = {};
      this.removable = {button: "false", edit: "false", number: "false", textarea: "false", password: "false"};
      this.addable = {};

      this.options = {saveFromBack: false};

      this.parent = null;
      this.path = "/";
      this.kind = "";
      this.history = {};
      this.node = null;

    }

    clone(_object) {

      var box = ["json", "parent", "path", "class", "type", "label", "value", "sort", "visiblity", "removable", "addable", "options", "node"]

      for(var i = 0; i < box.length; i++){

        this[box[i]] = _object[box[i]];

      }

    }

    toString() {
      return "";
    }

    clickInputEvent(_event){
      return "";
    }

    clickButtonEvent(_name){
      return "";
    }

    deletePropertyEvent(_name, _value){
      return "";
    }

    addPropertyEvent(_name){
      return "";
    }

    changeJsonEvent(_change){
      return "";
    }

    clickButton(_event){

      var target = _event.currentTarget;
      var goto = target.getAttribute("goto");

      this.goToChild(goto);

      this.clickButtonEvent(goto);

      return "";
    }

    backToParent(){

      if(this.options.saveFromBack){
        this.changeJson();
      }

      this.parent.generate();
      this.parent.child = null;

    }

    goToChild(_goto){

      var json = this.json[_goto];

      this.child = new jsonRender();
      this.child.clone(this);
      this.child.setJson(json);
      this.child.path = _goto;
      this.child.parent = this;

      this.child.changeJsonEvent = function(_change){

        var json = this.json;
        if(this.kind == "text"){
          json = JSON.stringify(this.json);
        }

        this.parent.json[this.path] = json;

        var change = {};
        change[this.path] = json;
        this.parent.changeJsonEvent(change);

      }

      this.child.generate();

    }

    deleteProperty(_event){

      var target = _event.currentTarget;
      var prop = target.getAttribute("delete");

      this.deletePropertyEvent(prop, ftBrowser.copyFromObject(this.json, prop));

      this.json = ftBrowser.removeFromObject(this.json, prop);

      this.generate();

    }

    addProperty(_event){

      var target = _event.currentTarget;
      var prop = target.getAttribute("add");

      var model = this.addable[prop];

      var name = "";
      if(!ftBrowser.isDef(model.name) || model.name == ""){
        name = ftBrowser.tokenGenerate(8);
      }else{
        name = model.name;
        if(name.indexOf("+") != -1){
          name = name.repalce("+", "");
          var number = countInObject(this.json, name);
          name = name + number;
        }
      }

      this.json[name] = model.body;

      this.addPropertyEvent(name);

      this.generate();

    }

    changeJson(_event){

      //console.log(this, event, arg);

      var inputs = this.node.getElementsByClassName(this.class.input);
      var change = {};

      for(var i = 0; i < inputs.length; i++){

        var value = "";
        var name = inputs[i].name;
        value = inputs[i].value;

        if(this.history[name] !== false && value != this.history[name]){

          this.json[name] = value;
          change[name] = value;
          this.history[name] = value;

        }

      }

      this.changeJsonEvent(change);

      return "";

    }

    setJson(_json){

      if(typeof _json == "string"){
        this.json = JSON.parse(_json);
        this.kind = "text";
      }else{
        this.json = _json;
        this.kind = "object";
      }

      this.actJson = this.json;

    }

    setClass(_name, _class){
      this.class[_name] = _class;
    }

    setType(_name, _type){
      this.type[_name] = _type;
    }

    setLabel(_name, _label){
      this.label[_name] = _label;
    }

    setValue(_name, _value){
      this.value[_name] = _value;
    }

    setSort(_name, _value){
      this.sort[_name] = _value;
    }

    setVisiblity(_name, _value){
      this.visiblity[_name] = _value;
    }

    setRemovable(_name, _value){
      this.removable[_name] = _value;
    }

    setAddable(_name, _value){
      this.addable[_name] = _value;
    }

    setInfo(_title, _info){

      _title = _title || this.value.title;
      _info = _info || this.value.info;

      var titleNode = this.node.getElementsByClassName(this.class.title)[0];
      titleNode.innerHTML = _title;

      var infoNode = this.node.getElementsByClassName(this.class.info)[0];
      infoNode.innerHTML = _info;

    }

    setOption(_name, _value){
      this.options[_name] = _value;
    }

    setNode(_node){
      this.node = _node;
    }

    render(_type, _name, _value, _object){

      var box = {type:"", class:"", label: "", value: "", visiblity: ""};
      var replaceCommand = {name: _name, value: _value, int: parseInt(_value), float: parseFloat(_value)};

      type = this.type[_name] || _type;
      for(var i in box){
        box[i] = this[i][_name] || this[i][type];
        box[i] = ftBrowser.replaceCommands(box[i],"$$", replaceCommand);
        box[i] = ftBrowser.replaceCommands(box[i],"$", _object);
      }

      if(box.visiblity == "true"){

        var container = document.createElement("div");
        container.className = this.class.container;

        var label = document.createElement("div");
        label.className = this.class.label;
        label.innerHTML = box.label;
        container.appendChild(label);

        var inputContainer = document.createElement("div");
        inputContainer.className = this.class.inputContainer;

        var input = null;
        if(type == "solid"){
          var input = document.createElement("span");
          input.innerHTML = box.value;
        }else if(type == "textarea"){
          var input = document.createElement("textarea");
          input.innerHTML = box.value;
        }else{
          var input = document.createElement("input");
          input.type = type;
          input.value = box.value;
        }

        input.className = this.class.input + " " + box.class;
        input.name = _name;
        var goto = this.goto[_name] || _name;
        if(goto != false) input.setAttribute("goto", goto);

        this.history[_name] = box.value;
        if(type == "button"){
          this.history[_name] = false;
          input.addEventListener("click", this.clickButton.bind(this));
        }else{
          input.addEventListener("click", this.clickInputEvent.bind(this));
        }

        inputContainer.appendChild(input);

        var removable = false;
        if(this.removable[type] == true || this.removable[_name] == true){
          removable = true;
        }
        var removablePos = ftBrowser.doubleIndexOf(this.removable, "*", 1);
        if(removablePos != -1){
          var removablePath = removablePos.replace("*", "");
          if(this.path == removablePath) removable = this.removable[removablePos];
        }
        if(removable){

          var buttonDel = document.createElement("button");
          buttonDel.className = this.class.delete;
          buttonDel.innerHTML = this.value.delete;
          buttonDel.setAttribute("delete", _name);

          buttonDel.addEventListener("click", this.deleteProperty.bind(this));
          inputContainer.appendChild(buttonDel);

        }

        container.appendChild(inputContainer);

        this.node.appendChild(container);

      }

    }

    generate(_node){

      this.history = {};
      this.node = _node || this.node;

      this.node.innerHTML = "";

      var titleNode = document.createElement("div");
      titleNode.className = this.class.title;
      titleNode.innerHTML = this.value.title;

      this.node.appendChild(titleNode);

      var infoNode = document.createElement("div");
      infoNode.className = this.class.info;
      infoNode.innerHTML = this.value.info;

      this.node.appendChild(infoNode);

      if(this.parent != null){

        var backButton = document.createElement("button");
        backButton.className = this.class.back;
        backButton.innerHTML = this.value.back;

        backButton.addEventListener("click", this.backToParent.bind(this));

        this.node.appendChild(backButton);

      }

      for(var i in this.json){

        if(typeof this.json[i] == "object"){
          this.render("button", i, "object", this.json[i]);
        }
        if(typeof this.json[i] == "string"){
          this.render("edit", i, this.json[i], {});
        }

      }

      if(this.addable[this.path]){

        var buttonAdd = document.createElement("button");
        buttonAdd.className = this.class.add;
        buttonAdd.innerHTML = this.value.add;
        buttonAdd.setAttribute("add", this.path);

        buttonAdd.addEventListener("click", this.addProperty.bind(this));
        this.node.appendChild(buttonAdd);

      }

      var submitButton = document.createElement("button");
      submitButton.className = this.class.submit;
      submitButton.innerHTML = this.value.submit;
      submitButton.addEventListener("click", this.changeJson.bind(this));

      if(!this.options.saveFromBack || this.parent == null){
        this.node.appendChild(submitButton);
      }

    }

}
