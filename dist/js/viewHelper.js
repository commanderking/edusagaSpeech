viewFadeAll={init:function(){this.characterDialogueDiv=$(".characterDialogueDiv"),this.sceneBG=$(".sceneBG"),this.characterDiv=$(".characterDiv"),this.taskList=$(".combinedTaskList"),this.sceneWrapper=$(".sceneWrapper"),this.respondButton=$(".respondButton"),this.navbarTop=$(".navbarTop"),this.bottomNavbar=$(".bottomNavbar"),this.nonTutorialUI=[this.characterDialogueDiv,this.sceneBG,this.taskList,this.sceneWrapper,this.navbarTop,this.bottomNavbar]},render:function(){this.nonTutorialUI.forEach(function(a){a.addClass("faded").addClass("disabled")})},resetFade:function(){this.nonTutorialUI.forEach(function(a){a.removeClass("faded").removeClass("disabled")}),this.characterDialogueDiv.removeClass("hidden"),this.characterDiv.removeClass("hidden"),this.taskList.removeClass("hidden")}},viewFadeAll.init(),viewFadeAll.render();