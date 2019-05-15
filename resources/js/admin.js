$(function () {
    //레이아웃***********************
	var winH = $(window).height(),
    	headerH = $('#header').height(),
    	tabnavW = $('tab_nav_inner').width();
	
	$('#container').css({'height':winH-headerH});
	$('.list_tab_nav').css('min-width',tabnavW);

	//GNB메뉴***********************
	$('#nav').each(function(){
		var nav = $('#nav'),
		    btn = $('#nav .btn_menu'),
		    cnt = $('#content'),
		    navW = nav.outerWidth();
		
		cnt.css({'margin-left':navW});
		
		btn.on('click',function(){
		    if($(this).parent().hasClass('open')){
		        closeMenu();
		    }else{
		        openMenu();
		    }
		});
		
		
        function closeMenu(){
		     nav.css({'left':-navW});
		     cnt.css({'margin-left':0});
		     btn.text('메뉴열기');
		     btn.parent().removeClass('open').addClass('close');
		}
		
		function openMenu(){
		    nav.css('left', 0);
		    cnt.css({'margin-left': navW});
		    btn.text('메뉴닫기');
		    btn.parent().removeClass('close').addClass('open');		    
		}
	});
	
	
	//메뉴드롭다운
    $('.list_menu li:has(ul)').addClass('has_sub');
    $('.list_menu li a').on('click',function(){
        var li = $(this).parent('li');
        if (li.hasClass('on')){
            li.removeClass('on').find('li').removeClass('on');
            li.find('ul').slideUp(200);
        }else{
            li.addClass('on');
            li.children('ul').slideDown(200);
            li.siblings('li').removeClass('on').find('ul').slideUp(200);
            li.siblings('li').find('li').removeClass('on');
        }
    })


    //탭메뉴***********************
    var scrollArea = $('.tab_nav_inner'),
    	tabNavW = scrollArea.width(),
    	ul = $('.tab_nav_wrap .list_tab_nav');
    
    $('.list_menu .item').click(function () {
    	$(this).parent().siblings().find('.selected').removeClass('selected');
    	$(this).addClass('selected');
        addTab($(this));
        ulWidth();
        ul.css({'left':0,'right':'unset'});
    });

    function addTab(link) {
        var menuName = ($(link).text()),
            rel = ($(link).attr('rel')),
            cntId = rel + '_content',
            currentTab = $('.tab_nav_wrap').find('.current .tab').text();

        // 이미 열려져 있는 탭일 경우
        if ($('#' + rel).length != 0) {
            if (rel != currentTab) {
                $('.tab_nav_wrap li').removeClass('current');
                $('#' + rel).parent().addClass('current');
                $('#content .cnt_wrap').hide();
                $('#' + cntId).show();
               
            }
            return;
        }else{
        	if($('.tab_nav_wrap li').length >= 5){
        		alert('5개 이상 열 수 없습니다.');
        		return;
        	}
        	// 열려져 있는 탭 
        	$('.tab_nav_wrap li').removeClass('current');
        	$('#content .cnt_wrap').hide();
        	
        	// 탭 추가
        	$('.tab_nav_wrap ul').prepend('<li class="current"><a href="#none" class="tab" id="' +
        			rel + '"role="tab" title=" '+ menuName +' ">' + menuName +
        	'</a><span class="btn_tabclose ico_tabclose" role="presentation">탭닫기</a></li>');
        	
        	var iframeVal = '<iframe style="width:100%; height: 100%;" scrolling="auto" scrollbars="auto" frameborder="0"  src="'+ $(link).prop('href') +'" ></iframe>';
        	$('#content').append('<div id="' + cntId + '" class="cnt_wrap">' + iframeVal + '</div>');
        	$('#' + cntId).show();
        }
    }

    //탭 선택 
    $(document).on('click', '.tab_nav_wrap li a.tab', function () {
    	_tabClick($(this).attr('id'));
    });

    //탭 닫기
    $(document).on('click', '.tab_nav_wrap .btn_tabclose', function () {
        var tabId = $(this).parent().find('.tab').attr('id'),
            cntId = tabId + '_content',
            idx = $(this).parent().index(),
            prevTab = $('.tab_nav_wrap li').eq(idx - 1),
            prevTabId = $(prevTab).find('a.tab').attr('id');

        if ($('.tab_nav_wrap li').length == 1) return;
        if( $(this).parent().hasClass('current') ){
        	$('#' + cntId).remove();
            $(this).parent().remove();
            prevTab.addClass('current').siblings().removeClass('current');
            $('#' + prevTabId + '_content').show();
        }else{
        	$('#' + cntId).remove();
            $(this).parent().remove();
        }
        ulWidth();
    });

    //탭 컨트롤버튼
    $('.btn_tab_ctrl button').on('click', function () {
        var size = $('.tab_nav_wrap li').size(),
            currentTab = $('.tab_nav_wrap').find('.current'),
            currentIdx = currentTab.index(),
            prevIdx = currentIdx - 1,
            nextIdx = currentIdx + 1,
            prevTab = $('.tab_nav_wrap li').eq(prevIdx),
            nextTab = $('.tab_nav_wrap li').eq(nextIdx),
            currentId = currentTab.find('.tab').attr('id') + '_content',
            prevTabId = prevTab.find('.tab').attr('id') + '_content',
            nextTabId = nextTab.find('.tab').attr('id') + '_content';
        	ulW = ul.outerWidth();
        if ($(this).hasClass('btn_tab_prev')) {
            //이전 탭
            if (currentIdx == 0){
            	scrollArea.scrollLeft(0); 
            	return;
            }
            currentTab.removeClass('current');
            prevTab.addClass('current');
            $('#' + currentId).hide();
            $('#' + prevTabId).show();
            
            var currentleft = prevTab.position().left,
        		left = tabNavW - currentleft - prevTab.width();
            if ( left < 0 ) ul.css('left',left);
            if (prevIdx == 0) ul.css('left',0) ;

        } else if ($(this).hasClass('btn_tab_next')) {
            //다음 탭 
            if (currentIdx == size - 1) {
            	return;  
            }
            currentTab.removeClass('current');
            nextTab.addClass('current');
            $('#' + currentId).hide();
            $('#' + nextTabId).show();
            
            var currentleft = nextTab.position().left,
            	left = tabNavW - currentleft - nextTab.width();
            if ( left < 0 ){ul.css('left',left);}
            
    	} else {
            //전체닫기
            $('.tab_nav_wrap li').remove();
            $('.cnt_wrap').remove();
            ulWidth();
            
            //default show
         
        }
    });
    
    function ulWidth(){
    	var ul = $('.list_tab_nav'),
    		liW = '300',
            liSize = $('.list_tab_nav li').size(),
            licurrentW = $('.list_tab_nav li.current').outerWidth(),
            ulNewW = (liW * (liSize-1)) + licurrentW;
        ul.css('width',ulNewW);
    }
    
    
    //날짜선택***********************
    $(function() {
        //모든 datepicker에 대한 공통 옵션 설정
        $.datepicker.setDefaults({
            dateFormat: 'yy-mm-dd' //Input Display Format 변경
            ,showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
            ,showMonthAfterYear:true //년도 먼저 나오고, 뒤에 월 표시
            ,changeYear: true //콤보박스에서 년 선택 가능
            ,changeMonth: true //콤보박스에서 월 선택 가능                
            ,showOn: "both" //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
            ,buttonImage: '../resources/img/dateimg.png' //버튼 이미지 경로
            ,buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
            ,buttonText: "선택" //버튼에 마우스 갖다 댔을 때 표시되는 텍스트                
            ,yearSuffix: "년" //달력의 년도 부분 뒤에 붙는 텍스트
            ,monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'] //달력의 월 부분 텍스트
            ,monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] //달력의 월 부분 Tooltip 텍스트
            ,dayNamesMin: ['일','월','화','수','목','금','토'] //달력의 요일 부분 텍스트
            ,dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'] //달력의 요일 부분 Tooltip 텍스트
            ,minDate: "-1M" //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
            ,maxDate: "+1M" //최대 선택일자(+1D:하루후, -1M:한달후, -1Y:일년후)          
        });

        //input을 datepicker로 선언
        $("#datepicker").datepicker();                    
        $("#datepicker2").datepicker();
        
        //From의 초기값을 오늘 날짜로 설정
        $('#datepicker').datepicker('setDate', 'today'); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)
        //To의 초기값을 내일로 설정
        $('#datepicker2').datepicker('setDate', '+1D'); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)
    });
    
	    
    
	//상세검색버튼***********************
    $('#detailsearch').each(function(){
        var tbl= $('.tbl_frm'),
            tblH = tbl.outerHeight(),
            trH = $('.tbl_frm tr').outerHeight();
        
        //defalut
        if( $('.tbodywrap').hasClass('close')) tbl.css('height',trH);
        // 기본열기 open / close
        
        $('#detailsearch').on('click',function(){
            if($('.tbodywrap').hasClass('open')){
		        closeTable();
		    }else{
		        openTable();
		    }
		});		
        
        function closeTable(){
            tbl.animate({height:trH},200);
             $('.tbodywrap').removeClass('open').addClass('close');
             //$('.grid_wrap').css('height','100%').css('height','-=99px');
             
		}		
		function openTable(){
            tbl.animate({height:tblH},200);
            $('.tbodywrap').removeClass('close').addClass('open');
            //$('.grid_wrap').css('height','100%').css('height','-=205px');
            
        }		
    }); // [end] 상세검색버튼
});


function _tabClick(_attrID){
    var contentname = _attrID + '_content';

    $('#content .cnt_wrap').hide();
    $('.tab_nav_wrap li').removeClass('current');

    $('#' + contentname).show();
    $('#' + _attrID).parent().addClass('current');
    
    /* 탭 선택 간 nav 메뉴 펼침 상태 변경 */
    var tabCurrentLi = $('.list_menu li a[rel='+ _attrID +']');
    if (!tabCurrentLi.parent().hasClass('on')) {
        if(!tabCurrentLi.hasClass('selected')){
            tabCurrentLi.closest('ul').find('.selected').removeClass('selected');
            tabCurrentLi.addClass('selected');
        } else {
        $('.list_menu').find('.selected').removeClass('selected');
        $('.list_menu').find('.on').removeClass('on').find('li').removeClass('on').parent('ul').slideUp(300);
        tabCurrentLi.addClass('selected');
        tabCurrentLi.parents('li').addClass('on').children('ul').slideDown(300);
        }
    }
    
    /* 진행 예정 - 메뉴 펼침 상태 변경 시 메뉴 인덱스 상태에 따른 유동 변경 */
    
    /* 진행 중 - URL로 접근 시 nav 메뉴 on, selected, 슬라이드 다운 추가 */
    $(document).ready(function () {
    if($('.list_menu').find('on').length>0) {
        console.log("읍으야?");
        tabCurrentLi.addClass('selected');
        tabCurrentLi.parents('li').addClass('on').children('ul').slideDown(300);
        }
    });
    
} /* function _tabclick end */