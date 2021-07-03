$(".custom-file-input").on("change", function () {
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
    $("img").remove(".detailImg");

    if ($("#productDetailImg")[0].files.length > 3) {
        alert("Chọn tối đa 3 ảnh chi tiết");
        
        $("img").remove(".detailImg");
        $("#productDetailImg")[0].value = '';
    } else {
        if (input.files && input.files[0]) {
            const l = input.files.length;
    
            for (let i = 0; i < l; i++) {
                const reader = new FileReader();
    
                reader.onload = function (e) {
                    $($.parseHTML("<img width='100px' height='150px' class='mr-3'>")).attr("src", e.target.result).appendTo('#previewDetailImg').addClass("detailImg");
                };
    
                reader.readAsDataURL(input.files[i]);
            }
    
        }
        else {
            $("#productDetailImg")[0].value = '';
        }
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

$(document).ready(setNavigation());

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
        if (path == "") {
            path = "/";
            //console.log("path2:" + path + ".");
        } else {
            //console.log("path:" + path + ".");
        }
        if (path.substring(0) === href) {

            $(this).closest('li').addClass('active');
            // console.log("href:"+ href + ".");
            if (href === '/list-accounts/list-active-accounts' || href === '/list-accounts/list-locked-accounts') {
                //console.log("hello");
                $("#collapse-user-acc").addClass("show");
                $(".user-acc a").each(() => {
                    $(this).closest('a').addClass('active');
                });
            }
        }
    });
}

function setCollapseItem() {
    var path = window.location.pathname;
    path = path.replace(/\/$/, "");
    path = decodeURIComponent(path);
    //console.log("path:" + path + ".");
    //if (path == "") alert("null");
    $(".nav-main a").each(function () {
        var href = $(this).attr('href');

        //alert(href);
        //alert("href:" + href + ".");
        if (path == "") {
            path = "/";
            //console.log("path2:" + path + ".");
        } else {
            //console.log("path:" + path + ".");
        }
        if (path.substring(0) === href) {

            $(this).closest('li').addClass('active');
            //console.log("href:"+ href + ".");
            if (href === '/list-accounts' || href === '/list-locked-accounts') {
                //console.log("hello");
                $(href).addClass('active');
            }
        }
    });
}

$("tr.row-manufacturer").click(function () {
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


const changeAccountQuantity = () => {
    const url = window.location.href + "/get-account-quantity";
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const data = JSON.parse(this.responseText);
            const script = document.getElementById('accountQuantity').innerHTML;
            const template = Handlebars.compile(script);

            const render = template({
                total: data.total,
                admin: data.admin,
                user: data.user,
                lockedAcc: data.lockedAcc,
            });

            document.getElementById("userAccountQuantity").innerHTML = render;
        }
    }

    xhttp.open("GET", url, true);
    xhttp.send();
}

const changeAccountState = (id, accountState) => {
    const myAccountID = document.getElementById("myAccountID").value;
    const url = window.location.href + "/accountState?id=" + id + "&accountState=" + accountState + "&myAccountID=" + myAccountID;
    //alert(`${id} ${accountState}`);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        //console.log(this);
        if (this.readyState == 4 && this.status == 200) {
            //changeAccountQuantity();
            //console.log(this);
            const data = JSON.parse(this.responseText);
            const script = document.getElementById('templateAccount').innerHTML;
            const template = Handlebars.compile(script);

            //.log(data.account.accountState)
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

            //Cập nhật số lượng các loại tài khoản
            changeAccountQuantity();
        }
    }

    xhttp.open("GET", url, true);
    xhttp.send();
}

const changeAccountRole = (id, accountRole) => {
    const myAccountID = document.getElementById("myAccountID").value;

    const url = window.location.href + "/account-role?id=" + id + "&accountRole=" + accountRole + "&myAccountID=" + myAccountID;
    //alert(`${id} ${accountState}`);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
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
            //Cập nhật số lượng các loại tài khoản
            changeAccountQuantity();
        }
    }

    xhttp.open("GET", url, true);
    xhttp.send();
}


function setTitleYourAccount() {
    const myAccountID = document.getElementById('myAccountID').value;
    const myAccountRole = document.getElementById('myAccountRole').value;
    const accountID = document.getElementsByClassName("row-account-user");
    const accountRole = document.getElementsByClassName("accountRole");
    const hideItem = document.getElementsByClassName("hide-item");

    if (myAccountRole === "Admin") {
        $(".superAdminMenu").hide();
    } else {
        $(".adminMenu").hide();
    }

    for (let i = 0; i < accountID.length; i++) {

        // if (accountRole[i].value === "Customer"){
        //     document.getElementsByClassName("cap-quyen")[i].style.display = "block";
        // } else if (accountRole[i].value === "Admin") {
        //     document.getElementsByClassName("xoa-quyen")[i].style.display = "none"
        // } else {

        // }

        if (myAccountID === accountID[i].value) {
            document.getElementsByClassName('notify')[i].innerHTML = "(Tài khoản của bạn)";
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

function disiableSubmitButton(){
    $('#submit-button').attr('disabled', true);
    $(document).on('click','body *',function(){
        console.log("hi");
        if($('#size-note').val() > 1){
            $('#submit-button').attr('disabled', false);
        } else {
            $('#submit-button').attr('disabled', true);
        }
    });
}

$(document).ready(function () {
    setTitleYourAccount();
    //disiableSubmitButton();
    closeEditInterface();

    const table = document.getElementById("editParametersTable");
    if (table != null){
        handleEditParametersForm(table);
    }
});

const isEmpty = () => {
    if(Number(document.getElementById("index").innerHTML) == 1){
        alert("Phiếu nhập hàng trống!");
    } else {
        $('#confirmPostModal').modal('show');
    }
}

const removeProduct = (product) => {
    const totalPriceOneProduct = product.childNodes[5].childNodes[0].value;
    console.log(product.childNodes[5].childNodes[0]);
    product.remove();

    let price = document.getElementsByClassName('price-in-row');//Thành tiền
    let quantity = document.getElementsByClassName('quantity');//Số lượng
    let importPrice = document.getElementsByClassName('import-price');//Giá nhập
    let idProduct = document.getElementsByClassName('id-product');//product id
    let productRow = document.getElementsByClassName('product-row');

    //Cập nhật stt va thuộc tính name của các thẻ input
    const size = productRow.length;
    let childNodes, index;

    for (let i = 0; i < size; i++){
        index = i + 1;
        childNodes = productRow[i].childNodes;

        childNodes[0].innerHTML = "<span class='index-row'>" + index + "</span>";
        childNodes[0].setAttribute('class', "text-center");
        childNodes[3].innerHTML = "<span><input type='number' class='import-price text-right w- form-control' min='0' value='" + importPrice[i].value + "' name='productPrice" + index + "' onchange='checkChange(" + index + ");' required/><span>";
        childNodes[4].innerHTML = "<input type='number' class='quantity text-right w-60 form-control' min='1' style='margin:auto; display:block;' value='" +  quantity[i].value + "' name='quantity" + index + "' onchange='checkChange(" + index + ");' required/>";
        childNodes[5].innerHTML = "<input class='price-in-row text-right border-0' style='outline: none !important;' name='totalPriceOneProduct" + index + "' value='" + price[i].value + "' readonly />";
        childNodes[7].innerHTML = "<input class='id-product' hidden name='idProduct" + index +"' value='" + idProduct[i].value + "'/>"
    }

    document.getElementById("index").innerHTML = Number(document.getElementById("index").innerHTML) - 1;
    document.getElementById("size-note").value = index - 1;
    let totalPrice = document.getElementById("total-price");
    totalPrice.value = Number(totalPrice.value) - Number(totalPriceOneProduct);
}

const checkChange = (index) => {
    index = index - 1;
    let totalPrice = document.getElementById("total-price");//Tổng chi
    let price = document.getElementsByClassName('price-in-row');//Thành tiền
    let quantity = document.getElementsByClassName('quantity');//Số lượng
    let importPrice = document.getElementsByClassName('import-price');//Giá nhập
    let newTotalPrice = 0;

    price[index].value = quantity[index].value * importPrice[index].value;

    for (let i = 0; i < price.length; i++) {
        newTotalPrice += Number(price[i].value);
    }

    totalPrice.value = newTotalPrice;
}

const checkExist = (name) => {
    let productName = document.getElementsByClassName('product-name');
    let i = 0;
    let length = productName.length;

    while (i < length && name != productName[i].innerHTML) {
        i++;
    }

    if (i == length) {
        return false;
    } else {
        let quantity = document.getElementsByClassName('quantity');//Số lượng
        let price = document.getElementsByClassName('price-in-row');//Thành tiền
        let totalPrice = document.getElementById("total-price");//Tổng chi
        let importPrice = document.getElementsByClassName('import-price');//Giá nhập

        quantity[i].value = Number(quantity[i].value) + 1;
        price[i].value = Number(quantity[i].value) * Number(importPrice[i].value);
        totalPrice.value = Number(totalPrice.value) + Number(importPrice[i].value);
        
        return true;
    }
}

const setValueForRow = (idProduct, name, manufacturer, baseprice) => {
    if (!checkExist(name)) {
        let table = document.getElementById("phieuNhapHangTable");
        let index = Number(document.getElementById("index").innerHTML);

        let row = table.insertRow(index);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        let cell7 = row.insertCell(6);
        let cell8 = row.insertCell(7);//product id

        cell1.innerHTML = "<span class='index-row'>" + index + "</span>";
        cell2.innerHTML = name;
        cell3.innerHTML = manufacturer;
        cell4.innerHTML = "<span><input type='number' class='import-price text-right w- form-control' min='0' value='" + baseprice + "' name='productPrice" + index + "' onchange='checkChange(" + index + ");' required/><span>";
        cell5.innerHTML = "<input type='number' class='quantity text-right w-60 form-control' min='1' style='margin:auto; display:block;' value='1' name='quantity" + index + "' onchange='checkChange(" + index + ");' required/>";
        cell6.innerHTML = "<input type='number' class='price-in-row text-right border-0' style='outline: none !important;' name='totalPriceOneProduct" + index + "' value='" + baseprice + "' readonly/>";
        cell7.innerHTML = "<div class='btn btn-danger remove-button' style='margin:auto; display:block;' onclick='removeProduct(" + "this.parentElement.parentElement" + ");'>Xóa</div>";
        cell8.innerHTML = "<input class='id-product' hidden name='idProduct" + index +"' value='" + idProduct + "'/>"

        row.setAttribute('class', "align-middle product-row");
        cell1.setAttribute('class', "text-center");
        cell2.setAttribute('class', "product-name");

        document.getElementById("index").innerHTML = index + 1;
        document.getElementById("size-note").value = index;
        let totalPrice = document.getElementById("total-price");
        totalPrice.value = Number(totalPrice.value) + Number(baseprice);
    }
}

const openEditInterface = () => {
    document.getElementById("edit-table").removeAttribute("hidden");
}

const closeEditInterface = () => {
    let id = document.getElementById("edit-table");
    if (id != null && id.getAttribute("hidden") == undefined){
        id.setAttribute("hidden", "true");
    }
   
}

const handleEditParametersForm = (table) => {
    for (let i = 1; i < table.rows.length; i++){
        table.rows[i].cells[4].onclick = () => {
            document.getElementsByName("parameterID")[0].value = table.rows[i].cells[0].children[0].value;
            document.getElementsByName("parameterName")[0].value = table.rows[i].cells[1].children[0].value;
            document.getElementsByName("value")[0].value = table.rows[i].cells[2].children[0].value;
            document.getElementsByName("state")[0].value = table.rows[i].cells[3].children[0].value;
            document.getElementById("editParametersForm").action = "/list-regulations/edit/" + table.rows[i].cells[0].children[0].value + "?_method=PUT";
        }
    }
}