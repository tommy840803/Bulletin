var app=angular.module('myapp',[]);
app.controller('myctrl',function($scope,$http){


    //獲得資料
    angular.element(document).ready(function () {
        $http({

            method: "GET",
            url: "/welcome",
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

        }).then(function successCallback(response) {
            $scope.data = response.data;
        }, function errorCallback(response) {
            //console.log(response);
        });
    });


    $scope.getBackgroundColor = function(index){

            if(index==0 || index==3 || index==6){
                return "#FF9F89";
            }
            if(index==1 || index==4 || index==7){
                return "#F4A261";
            }
            if(index==2 || index==5 || index==8){
                return "#E9C46A";
            }

    }



    //新增文章
    $scope.addArticle = function(){

        $http({

            method: "POST",
            url: "/welcome",
            data: $.param({title:$scope.addTitle,content:$scope.addContentText}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

        }).then(function successCallback(response) {
            alert("新增成功");
            location.reload();
        }, function errorCallback(response) {
            console.log(response);
        });
    }

    //刪除文章
    $scope.delArticle = function(index){
        console.log("delKey: "+ $scope.data[index].id);
        $http({
            method: "POST",
            url: "/DelServlet",
            data: $.param({delKey:$scope.data[index].id}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

        }).then(function successCallback(response) {
            alert("刪除成功");
            //重新載入畫面
            location.reload();
        }, function errorCallback(response) {
            console.log(response);
        });
    }

    //點擊文章，看內容
    $scope.modal_click=function(index){

        //打開完整文章
        $(".overlay").fadeToggle(200);
        console.log("打開完整文章");

        $scope.showTitle="";
        $scope.showDate="";
        $scope.showContentText="";

        $scope.showTitle=$scope.data[index].title;
        $scope.showDate=$scope.data[index].date;
        $scope.showContentText=$scope.data[index].contentText;

    }


    //打開編輯
    $scope.modal_edit=function(index){

        console.log("打開編輯文章");
        $(".overlayEdit").fadeToggle(200);

        $scope.editKey  = $scope.data[index].id;
        $scope.editTitle = $scope.data[index].title;
        $scope.editDate = $scope.data[index].date;
        $scope.editContentText = $scope.data[index].contentText;

    }

    //提交編輯資料
    $scope.edit_submit=function(){
        console.log("送出編輯文章");
        console.log("key:"+$scope.editKey+" editTitle:"+$scope.editTitle+" ContentText:"+$scope.editContentText);
        $http({

            method: "POST",
            url: "/UpdateServlet",
            data: $.param({delKey:$scope.editKey,title:$scope.editTitle,contentText:$scope.editContentText}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

        }).then(function successCallback(response) {
            alert("修改文章成功");
            location.reload();
        }, function errorCallback(response) {
            console.log(response);
        });


    }

    //取消編輯
    $scope.edit_cancel=function(){
        console.log("取消編輯文章");
        $(".overlayEdit").fadeToggle(200);
    }

})

$(document).ready(function(){

	//Title Overflow
	var len = 25;
	$(".center").each(function(i){
	    if($(this).text().length>len){
	        $(this).attr("title",$(this).text());
	        var text=$(this).text().substring(0,len-1)+"...";
	        $(this).text(text);
	    }
	});

    //關閉完整文章
    $('#fullActicle').on('click', function () {
        $(".overlay").fadeToggle(200);
        console.log("關閉完整文章");
    });

    //關閉編輯文章
    $('#cancelEdit').on('click', function () {
        $(".overlayEdit").fadeToggle(200);
        console.log("關閉編輯文章");
    });



});
