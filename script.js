var zoomStep = 6;
var zoomStepMax = 6;
var focusinIdx = 0;
var is_shuffle = false;


$(document).ready(function(){
    $("#close-btn").click(function(){
        gotoMainPage();
    });
    $("#menu-btn").click(function(){
        $("nav").addClass("active");
    });
    
    $('article .title').wordBreakKeepAll();
    $('article .text p').wordBreakKeepAll();
    $('.project-description').wordBreakKeepAll();
	
    var maxGrid = gridSetting(zoomStepMax);
    var articleLen = $("#main-page article").length;
    var cloneLen = (maxGrid.col * maxGrid.row) - articleLen;
    var $wrapper = $("#article-wrapper");
    for(var i=0; i<cloneLen; i++){
        var $clone = $("#main-page article").eq(i).clone();
        $wrapper.append($clone);
    }
    
    
	zoomFunc();
	viewFunc(focusinIdx);
	$("#main-page .article-container").click(function(){
		var content = $(this).children(".article-inner").html();
		$("#detail .detail-inner").html(content);
		$(".article-inner").addClass("hide");
		$("#detail").addClass("active");
        $("#detail .detail-container").addClass("back");
	});
	$("#detail .blind").click(function(){
		$(".article-inner").removeClass("hide");
		$("#detail").removeClass("active");
	});
	$(".detail-container").click(function(){
		$(this).toggleClass("back");
	});
	$("nav>ul>li>a").eq(0).addClass("active");
	$("a").click(function(){
		
		var target = $(this).attr("data-link");
        
        $(".article-inner").removeClass("hide");
        $("#detail").removeClass("active");
        $("section").removeClass("active");
        $("#"+target).addClass("active");
        $("a").removeClass("active");
		$(this).addClass("active");
        
		if(target == "shuffle"){
			$(this).siblings().addClass("active");
            var ran = Math.floor(Math.random() * 2);
            var target;
            switch(ran){
                case 0: target = "shuffle-image"; 
                        break;
                case 1: target = "shuffle-text"; 
                        break;
            }
            $("#"+target).addClass("active");
            $("#menu-"+target).addClass("active");
            gotoShuffle(target);
		}
		else{

			if(target == "main-page") {
                gotoMainPage();
            }
			else $("#menu-btn").addClass("black");
			
			gotoShuffle(target);
		}
		
	});
	
	$("input").focusin(function(){
		$(this).siblings("label").addClass("hide");
	});
	$("input").focusout(function(){
		if($(this).val() == "") $(this).siblings("label").removeClass("hide");
		
	});
	$("textarea").focusin(function(){
		$(this).siblings("label").addClass("hide");
	});
	$("textarea").focusout(function(){
		if($(this).val() == "") $(this).siblings("label").removeClass("hide");
		
	});
	
	$("#shuffle-btn").click(function(){
		var len = $("#main-page article").length;
        $("#main-page article").each(function(){
            var ran = Math.floor(Math.random() * len);
            $("#article-wrapper article").eq(ran).after($(this));
        });
		viewFunc(focusinIdx);
	});
	
	$("#upload-btn").click(function(){
		$(this).parents("section").children(".popup").addClass("active");
	});
	
	$("#log-in-btn").click(function(){
		$(this).parents("section").children(".popup").addClass("active");
	});
	
	$(".popup .enter").click(function(){
		$(this).parent().removeClass("active");
		$("input").val("");
		$("textarea").val("");
		$("label").removeClass("hide");
        gotoMainPage();
	});
    
    imageSizeCover($(".image"));
	
	$("#shuffle-image article").click(function(){
        is_shuffle = false;
    });
	$("#shuffle-text article").click(function(){
        is_shuffle = false;
    });
});


function loading(){
    $("#loading").fadeOut(500);
    imageSizeCover($(".image"));
}

function gotoMainPage(){
    $("nav").removeClass("active");
    $("section").removeClass("active");
    $("#main-page").addClass("active");
    $("#menu-btn").removeClass("black");
    $("a").removeClass("active");
    $(".depth2").removeClass("active");
    $("#menu-main-page").addClass("active");
}

function gotoShuffle(target){
    $(".depth2").addClass("active");
    $("#menu-shuffle").addClass("active");
    if(target == "shuffle-image" || target == "shuffle-text"){
        shuffleSlider(target, true);
    }
    else{
        $(".depth2").removeClass("active");
        $("#menu-shuffle").removeClass("active");
    }
}

var is_shuffle = false;
function shuffleSlider(mode, start){
    if(start) is_shuffle = true;
    
    if($("#"+mode).hasClass("active") && is_shuffle){
        shufflePageFunc(mode);
        setTimeout(function(){shuffleSlider(mode, false);}, 200);
    }
    
}

function shufflePageFunc(mode){
    var articleLen = $("#main-page article").length;
    var ran = Math.floor(Math.random() * articleLen);
    var $clone = $("#main-page article").eq(ran).children(".article-container").clone();
    if(mode == "shuffle-image"){
        $clone.find(".text").remove();
        $("#shuffle-image article .article-inner").html($clone.find(".image"));
        $("nav").addClass("active");
    }
    else if(mode == "shuffle-text"){
        $clone.find(".image").remove();
        $("#shuffle-text article .article-inner").html($clone.find(".text"));
        $("nav").addClass("active"); 
    }
}


function zoomFunc(){
	$( '#article-wrapper article' ).addClass("active");
	$( '#article-wrapper' ).addClass("zoom"+zoomStep);
    $( '#fix-point-container' ).addClass("zoom"+zoomStep);
	$( '#article-wrapper article' ).on('mousewheel DOMMouseScroll', function(e) {
		e.preventDefault();
		var E = e.originalEvent;
		delta = 0;
		//console.log(E);
		if (E.detail) {
			delta = E.detail * -40;
		}else{
			delta = E.wheelDelta;
		};
		
		if(delta > 0 && zoomStep < zoomStepMax){
            zoomStep++;
            focusinIdx = $( '#article-wrapper article' ).index(this);
            viewFunc(focusinIdx);
        } 
		else if(delta < 0 &&zoomStep > 0){
            zoomStep--;
            focusinIdx = $( '#article-wrapper article' ).index(this);
            viewFunc(focusinIdx);
        } 
		
		
		
		
	});
}

function viewFunc(idx){
	var maxGrid = gridSetting(zoomStepMax);
	var currentGrid = gridSetting(zoomStep);

	var pos = {};
	pos.col = idx % maxGrid.col;
	pos.row = parseInt(idx / maxGrid.col);

	var viewStart = {};
	viewStart.col = pos.col - Math.floor(currentGrid.col/2);
	viewStart.row = pos.row - Math.floor(currentGrid.row/2);

	if(viewStart.col < 0) viewStart.col = 0;
	else if(viewStart.col+currentGrid.col > maxGrid.col){
		viewStart.col = maxGrid.col - currentGrid.col;
	}


	if(viewStart.row < 0) viewStart.row = 0;
	else if(viewStart.row+currentGrid.row > maxGrid.row){
		viewStart.row = maxGrid.row - currentGrid.row;
	} 

	$( '#article-wrapper article' ).removeClass();
	for(var i=viewStart.col; i<viewStart.col+currentGrid.col; i++){
		for(var j=viewStart.row; j<viewStart.row+currentGrid.row; j++){
			var activeIdx = i + j*maxGrid.col;
			$( '#article-wrapper article' ).eq(activeIdx).addClass("active");
		}
	}

	$( '#article-wrapper' ).removeClass().addClass("zoom"+zoomStep);
    $( '#fix-point-container' ).removeClass().addClass("zoom"+zoomStep);
	if(zoomStep >= 2) $( '#article-wrapper' ).addClass("text-hide");
}

function gridSetting(zoomStep_){
	var grid = {};
	grid.col = zoomStep_*2 + 3;
	grid.row = zoomStep_ + 2;
	
	return grid;
}

function imageSizeCover(container){
    container.children("img").each(function(){
                var elem = $(this).get(0);
                tRatio = 1,
                im = $(this);
                ih = elem.height,//inital image height
                iw = elem.width,//initial image width
                iRatio = ih/iw;

            if (tRatio > iRatio) {//if portrait
                im.addClass('ww').removeClass('wh');//set width 100%
            } else {//if landscape
                im.addClass('wh').removeClass('ww');//set height 100%
            }
    });
}

/*
function shuffleFunc(target){
    var animationTime = 1000;
    var easing = "ease";
    target.animate({angle: 90}, {
        step: function(angle) {
            $(this).find(".image").css('-moz-transform','translate(-50%, -50%) rotateY('+angle+'deg)');
            $(this).find(".image").css('-webkit-transform','translate(-50%, -50%) rotateY('+angle+'deg)');
            $(this).find(".image").css('-o-transform','translate(-50%, -50%) rotateY('+angle+'deg)');
            $(this).find(".image").css('transform','translate(-50%, -50%) rotateY('+angle+'deg)');
            $(this).find(".article-line").css('-moz-transform','rotateY('+angle+'deg)');
            $(this).find(".article-line").css('-webkit-transform','rotateY('+angle+'deg)');
            $(this).find(".article-line").css('-o-transform','rotateY('+angle+'deg)');
            $(this).find(".article-line").css('transform','rotateY('+angle+'deg)');
        },
        duration: animationTime,
        complete: function(){
            var ran = Math.floor(Math.random() * $("#article-wrapper article").length);
            $("#article-wrapper article").eq(ran).after($(this));
            
            $(this).animate({angle: 0}, {
                step: function(angle) {
                    $(this).find(".image").css('-moz-transform','translate(-50%, -50%) rotateY('+angle+'deg)');
                    $(this).find(".image").css('-webkit-transform','translate(-50%, -50%) rotateY('+angle+'deg)');
                    $(this).find(".image").css('-o-transform','translate(-50%, -50%) rotateY('+angle+'deg)');
                    $(this).find(".image").css('transform','translate(-50%, -50%) rotateY('+angle+'deg)');
                    $(this).find(".article-line").css('-moz-transform','rotateY('+angle+'deg)');
                    $(this).find(".article-line").css('-webkit-transform','rotateY('+angle+'deg)');
                    $(this).find(".article-line").css('-o-transform','rotateY('+angle+'deg)');
                    $(this).find(".article-line").css('transform','rotateY('+angle+'deg)');
                },
                duration: animationTime,
                complete: function(){
                    $(this).find(".image").attr("style", "");
                    $(this).find(".article-line").attr("style", "");
                }
            });
        }
    });
}
*/