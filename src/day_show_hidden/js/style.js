
$(document).ready(function(){

	$('.main p').replaceWith(function(){
		return '\
		<div class="slideOutTip '+$(this).attr('class')+'" style="'+$(this).attr('style')+'">\
			\
			<div class="tipVisible">\
				<div class="tipIcon">\
					<div class="plusIcon">\
					</div>\
				</div>\
				<p class="tipTitle">'+$(this).attr('title')+'</p>\
			</div>\
			\
			<div class="slideOutContent">\
				<p>'+$(this).html()+'</p>\
			</div>\
		</div>';
	});

	$('.slideOutTip').each(function(){
		/*
		 根据标题的宽度隐式定义的slideouts宽度，因为IE没有自己计算。
		*/
		$(this).width(40+$(this).find('.tipTitle').width());
	});
	
	/*监听单击事件*/
	$('.tipVisible').bind('click',function(){
		var tip = $(this).parent();
		
		/* 如果打开/关闭动画正在进行中，退出函数*/
		if(tip.is(':animated'))
			return false;
		if(tip.find('.slideOutContent').css('display') == 'none'){
			tip.trigger('slideOut');
		}else {
            tip.trigger('slideIn');
		}
	});
	
	$('.slideOutTip').bind('slideOut',function(){

		var tip = $(this);
		var slideOut = tip.find('.slideOutContent');
		
		/* 关闭当前打开的所有slideouts： */
		$('.slideOutTip.isOpened').trigger('slideIn');
		
		/* 只有第一次点击式执行*/
		if(!tip.data('dataIsSet')){
			tip	.data('origWidth',tip.width())
				.data('origHeight',tip.height())
				.data('dataIsSet',true);
			
			if(tip.hasClass('openTop')){
				/*
				 如果此式打开的顶部，而不是底部，计算距离的底部固定式吧。
				*/
				tip.css({
					bottom	: tip.parent().height()-(tip.position().top+tip.outerHeight()),
					top		: 'auto'
				});
				
				/* 固定标题式的底部，所以它不滑到顶部开放： */
				tip.find('.tipVisible').css({position:'absolute',bottom:3});
				
				/* 移动内容上方的标题，所以它可以滑动到顶部: */
				tip.find('.slideOutContent').remove().prependTo(tip);
			}
			
			if(tip.hasClass('openLeft'))
			{
				/*
				 如果此式打开左边，而不是权利，解决它的右所以左边缘可以扩展而不移动整个div：
				*/
				tip.css({
					right	: Math.abs(tip.parent().outerWidth()-(tip.position().left+tip.outerWidth())),
					left	: 'auto'
				});
				tip.find('.tipVisible').css({position:'absolute',right:3});
			}
		}
		
		/* 调整式适合的内容，然后淡出视野: */
		tip.addClass('isOpened').animate({
			width	: Math.max(slideOut.outerWidth(),tip.data('origWidth')),
			height	: slideOut.outerHeight()+tip.data('origHeight')
		},function(){
			slideOut.fadeIn();
		});

	}).bind('slideIn',function(){
		var tip = $(this);
		/* 隐藏式的内容和恢复原始大小: */
		tip.find('.slideOutContent').fadeOut('fast',function(){
			tip.animate({
				width	: tip.data('origWidth'),
				height	: tip.data('origHeight')
			},function(){
				tip.removeClass('isOpened');
			});
		});

	});
});