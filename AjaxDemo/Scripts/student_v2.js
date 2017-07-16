/* FileName: student.js
Project Name: AjaxDemo
Date Created: 5/10/2015 8:49:08 AM
Description: Auto-generated
Version: 1.0.0.0
Author:	Lê Thanh Tuấn - Khoa CNTT
Author Email: tuanitpro@gmail.com
Author Mobile: 0976060432
Author URI: http://tuanitpro.com
License: 
http://tuanitpro.com/crud-using-ajax-in-asp-net-mvc
*/


$(document).ready(function () {
    _getAll();
});

// Hàm này chúng ta bổ sung thêm 2 cột Picture & Score
// Update lại hàm này, để có thể edit ngay trực tiếp
// Tiếp theo chúng ta sẽ thực hiện việc upload ảnh trực tiếp ở đây.
function _getAll() {
    $.ajax({
        url: "/Home/List",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('#list tbody').html("Đang tải dữ liệu. Vui lòng đợi");
            var html = '';
            $.each(result, function (key, item) {
                html += '<tr data-id=' + item.Id + '>';
                html += '<td>' + item.Id + '</td>';
                html += '<td>';
               
                html += " <input type='file' name='fileImg' class='fileImg' style='display: none' accept='image/*' />";

                html += "<img class='imgPicture' src='" + item.Picture + "' style='width: auto; height: 70px; cursor:pointer' onclick='return _editPicture(this)'/>";

                html + '</td>';
                html += '<td><input type="text" class="form-control name" value="' + item.Name + '" onchange="return _edit(this);"/></td>';
                html += '<td>';
                html += '<select class="form-control status" onchange="return _edit(this);">';
                if (item.Status == "New") {
                    html += '<option value="New" selected>New</option>';
                    html += '<option value="Old">Old</option>';
                }
                else {
                    html += '<option value="New" >New</option>';
                    html += '<option value="Old" selected>Old</option>';
                }
                html += '</select>';
                html += '</td>';
                html += '<td><input type="number" min="1" max="10" class="form-control score" value="' + item.Score + '" onchange="return _edit(this);"/></td>';
                html += '<td><a class="btn btn-danger" href="#" onclick="return _delete(' + item.Id + ')">Delete</a></td>';
                html += '</tr>';
            });
            $('#list tbody').html(html);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });

    $('#btnUpdate').hide();
    $('#btnAdd').show();
    return false;
}
function _getById(id) {
    $.ajax({
        url: '/Home/Get/' + id,
        // data: JSON.stringify(dto),
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('#StudentId').val(result.Id);
            $('#Name').val(result.Name);
            $('#Status').val(result.Status);

            $('#myModal').modal('show');
            $('#btnUpdate').show();
            $('#btnAdd').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}
function _add(data) {
    var picture = $(data).closest("tr").find('.linkFile').val();
    var name = $(data).closest("tr").find('.name').val();
    var status = $(data).closest("tr").find('.status').val();
    var score = $(data).closest("tr").find('.score').val();
    var obj = {
        Name: name,
        Picture: picture,
        Status: status,
        Score: score,
    }
    $.ajax({
        url: '/Home/Create',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            _getAll();
            $('#myModal').modal('hide');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}
function _edit(data) {
    var id = $(data).closest("tr").data('id');
    var name = $(data).closest("tr").find('.name').val();
    var status = $(data).closest("tr").find('.status').val();
    var score = $(data).closest("tr").find('.score').val();
    var obj = {
        Id: id,
        Name: name,
        Status: status,
        Score: score,
    }

    $.ajax({
        url: '/Home/Update',
        data: JSON.stringify(obj),
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (result) {
            _getAll();
            $('#myModal').modal('hide');
            $("#message").html("Saved");
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}
function _delete(id) {
    var cf = confirm('Are you sure want to permanently delete this row?');
    if (cf) {
        $.ajax({
            url: '/Home/Delete/' + id,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (result) {
                _getAll();
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    }
}

function _doUpload(obj) {
    var fileUpload = $(obj).closest("tr").find(".fileUpload");
    var btnSelectImage = $(obj).closest("tr").find(".btnSelectImage");
    var linkFile = $(obj).closest("tr").find(".linkFile");
    fileUpload.trigger("click").change((e) => {       
        // lấy thông tin file & upload
        var formData = new FormData();
        var files = fileUpload.get(0).files;
        if (files.length > 0) {
            formData.append("uploadFile", files[0]);
        }
        $.ajax({
            url: "/Home/Upload",
            type: "POST",
            processData: false,
            contentType: false,
            data: formData,
           
            success: function (response) {               
                if (response.code == 200) {
                    btnSelectImage.attr("src", response.data);
                    $(linkFile).val(response.data);
                }
                else {
                    alert(response.message);
                }
                
            },
            error: function () { },
        });
        return false;
    });
   
}
// hàm này thực hiện việc update lại một hình ảnh của dòng được chọn
function _editPicture(obj) {
    var id = $(obj).closest("tr").data("id");
    var fileImg = $(obj).closest("tr").find('.fileImg');
    var imgPicture = $(obj).closest("tr").find('.imgPicture');
    fileImg.trigger("click").change(()=> {              
            var data = new FormData();
            var files = $(fileImg).get(0).files;
            if (files.length > 0) {
                data.append("uploadFile", files[0]);
            }
            $.ajax({
                url: "/Home/Upload",
                type: "POST",
                processData: false,
                contentType: false,
                data: data, 
                success: function (response) { 
                    if (response.code == 200) {
                        $(imgPicture).attr('src', response.data);
                        // Upload thành công thì update lại data
                        $.post("/home/UpdatePicture", { id: id, fileUrl: response.data }, function () { });
                    }                                      
                },
                error: function () { },
                complete: function () { }
            });
        
    });
}