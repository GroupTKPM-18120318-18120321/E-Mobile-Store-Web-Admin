$(".custom-file-input").on("change", function() {
    var filename = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(filename);
});

// $(".input-files").on("change", function() {
//     //var filename = $(this).val().split("\\").pop();
//     //$(this).siblings(".upload-files").addClass("selected").html($(".input-files", this)[0].files.length);
//     $('.input-files').attr('src', $(".input-files", this)[0].files.length);
// });

function readOneURL(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            $('#previewMainImg').attr('src', e.target.result);
            $('#previewMainImg').show();
        };

        reader.readAsDataURL(input.files[0]);
    } else {
        $('#previewMainImg').hide();
    }
}

function readMultipleURL(input) {
    if (input.files && input.files[0]) {
        //console.log("inputfile = " + input.files)
        $("img").remove(".detailImg");
        const l = input.files.length;

        for (let i = 0; i < l; i++){
            const reader = new FileReader();

            reader.onload = function (e) {
                $($.parseHTML("<img width='100px' height='150px' class='mr-3'>")).attr("src", e.target.result).appendTo('#previewDetailImg').addClass("detailImg");
            };
    
            reader.readAsDataURL(input.files[i]);
        }
        
    }
    else {    	
        //alert($('.detailImg').length)
        $("img").remove(".detailImg");
    }
}

function formatDate(dateStr) {
    const [day, month, year] = dateStr.split("-");
    document.getElementById('admin-dob').innerHTML = "aaaaa";
    console.log(new Date(year, month - 1, day));
    return new Date(year, month - 1, day);
}

$(function () {
    setNavigation();
});

$( document).ready(setNavigation());

function setNavigation() {
    var path = window.location.pathname;
    path = path.replace(/\/$/, "");
    path = decodeURIComponent(path);
    //console.log("path:" + path + ".");
    //if (path == "") alert("null");
    $(".nav-main a").each(function () {
        var href = $(this).attr('href');
        
        //alert(href);
        //alert("href:" + href + ".");
        if (path == ""){
            path = "/";
            //console.log("path2:" + path + ".");
        } else {
            //console.log("path:" + path + ".");
        } 
        if (path.substring(0) === href) {
            
            $(this).closest('li').addClass('active');
           // console.log("href:"+ href + ".");
            if(href === '/list-accounts/list-active-accounts' || href === '/list-accounts/list-locked-accounts'){
                //console.log("hello");
                $("#collapse-user-acc").addClass("show");
                $(".user-acc a").each(()=>{
                    $(this).closest('a').addClass('active');
                });
            }
        }
    });
}

function setCollapseItem(){
    var path = window.location.pathname;
    path = path.replace(/\/$/, "");
    path = decodeURIComponent(path);
    //console.log("path:" + path + ".");
    //if (path == "") alert("null");
    $(".nav-main a").each(function () {
        var href = $(this).attr('href');
        
        //alert(href);
        //alert("href:" + href + ".");
        if (path == ""){
            path = "/";
            //console.log("path2:" + path + ".");
        } else {
            //console.log("path:" + path + ".");
        } 
        if (path.substring(0) === href) {
            
            $(this).closest('li').addClass('active');
            //console.log("href:"+ href + ".");
            if(href === '/list-accounts' || href === '/list-locked-accounts'){
                //console.log("hello");
                $(href).addClass('active');
            }
        }
    });
}

$( "tr.row-manufacturer" ).click(function (){
    const index = $(this).index();
    //alert("clicked " + index);
    const id = $('td.manufacturerID')[index].innerHTML;
    $('#manufacturerId').val(id);
});

//Password
// window.onload = function () {
//     document.getElementById("password").onchange = validatePassword;
//     document.getElementById("confirm_password").onchange = validatePassword;
//     //document.getElementById("loadTitle").onload = setTitleYourAccount();
// }

// function validatePassword(event) {
//     var pass2 = document.getElementById("confirm_password").value;
//     var pass1 = document.getElementById("password").value;
//     if (pass1 != pass2) {
//         event.preventDefault();
//         document.getElementById("warning_password").style.display = "block";
//     }
//     else
//         document.getElementById("warning_password").style.display = "none";
//     //empty string means no validation error
// }

const changeAccountState = (id, accountState) => {
    const myAccountID =  document.getElementById("myAccountID").value;
    const url = window.location.href + "/accountState?id=" + id + "&accountState=" + accountState + "&myAccountID=" + myAccountID;
    //alert(`${id} ${accountState}`);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const data = JSON.parse(this.responseText);
            const script = document.getElementById('templateAccount').innerHTML;
            const template = Handlebars.compile(script);

            console.log(data.account.accountState)
            const render = template({
                accountState: data.account.accountState,
                _id: data.account._id,
                email: data.account.email,
                phoneNumber: data.account.phoneNumber,
                name: data.account.name,
                userName: data.account.userName,
                accRole_user: data.accRole.user,
                accRole_admin: data.accRole.admin,
                accRole_superAdmin: data.accRole.superAdmin,
                role: data.account.role.roleName
            });
          
            document.getElementById(id).innerHTML = render;
            setTitleYourAccount();
        }
    }

    xhttp.open("GET", url, true);
    xhttp.send();
}

const changeAccountRole = (id, accountRole) => {
    const myAccountID =  document.getElementById("myAccountID").value;
    //alert(accountRole);
    const url = window.location.href + "/account-role?id=" + id + "&accountRole=" + accountRole + "&myAccountID=" + myAccountID;
    //alert(`${id} ${accountState}`);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            //alert(this.responseText)
            const data = JSON.parse(this.responseText);
            
            const script = document.getElementById('templateAccount').innerHTML;
            const template = Handlebars.compile(script);

            const render = template({
                accountState: data.account.accountState,
                _id: data.account._id,
                email: data.account.email,
                phoneNumber: data.account.phoneNumber,
                name: data.account.name,
                userName: data.account.userName,
                accRole_user: data.accRole.user,
                accRole_admin: data.accRole.admin,
                accRole_superAdmin: data.accRole.superAdmin,
                role: data.account.role.roleName
            });
          
            document.getElementById(id).innerHTML = render;
            setTitleYourAccount();
        }
    }

    xhttp.open("GET", url, true);
    xhttp.send();
}


function setTitleYourAccount(){
    const myAccountID = document.getElementById('myAccountID').value;
    const myAccountRole = document.getElementById('myAccountRole').value;
    const accountID = document.getElementsByClassName("row-account-user");
    const accountRole = document.getElementsByClassName("accountRole");
    const hideItem = document.getElementsByClassName("hide-item");

    if(myAccountRole === "Admin"){
        $(".superAdminMenu").hide();
    } else {
        $(".adminMenu").hide();
    }

    for (let i = 0; i < accountID.length; i++){

        // if (accountRole[i].value === "Customer"){
        //     document.getElementsByClassName("cap-quyen")[i].style.display = "block";
        // } else if (accountRole[i].value === "Admin") {
        //     document.getElementsByClassName("xoa-quyen")[i].style.display = "none"
        // } else {

        // }

        if (myAccountID === accountID[i].value){
            document.getElementsByClassName('notify')[i].innerHTML="(Tài khoản của bạn)";
            //alert("i = " + i);
            //$("div.aaa:nth-child(i) > li.hide-item").hide();

            // for (let j = i; j < i + 10; j++){
            //     hideItem[j].style.display = "none";
            //     //alert(j);
            // }
            //document.getElementsByClassName("hide-item")[i].style.display = "none";
            //document.getElementsByClassName("hide-item-1")[i].style.display = "none";
            break;
        }

    }
}

$(document).ready(function(){
    setTitleYourAccount();
});
