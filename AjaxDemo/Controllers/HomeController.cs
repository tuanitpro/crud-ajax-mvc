using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AjaxDemo.Models;
using System.IO;

namespace AjaxDemo.Controllers
{
    public class HomeController : Controller
    {
        StudentDbContext db = new StudentDbContext();
        // Trong demo này không có validate dữ liệu, mục đích là để gõ cho nhanh.
        // Khi làm thực tế, các bạn chú ý vấn đề này nhé

        // Mục tiêu video này là tạo một trang Thêm Xóa Sửa giống Excel
        
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult V2()
        {
            return View();
        }

        public JsonResult List()
        {
            var model = db.Students.ToList();
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Get(int id)
        {
            var model = db.Students.FirstOrDefault(x => x.Id == id);
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Create(Student entity)
        {
            db.Students.Add(entity);
            db.SaveChanges();
            return Json("OK", JsonRequestBehavior.AllowGet);
        }

        public JsonResult Update(Student entity)
        {
            db.Entry<Student>(entity).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return Json("OK", JsonRequestBehavior.AllowGet);
        }
        public JsonResult UpdatePicture(int id, string fileUrl)
        {
            var entity = db.Students.FirstOrDefault(x => x.Id == id);
            entity.Picture = fileUrl;
            db.Entry<Student>(entity).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return Json("OK", JsonRequestBehavior.AllowGet);
        }

        public JsonResult Delete(int id)
        {
            var entity = db.Students.FirstOrDefault(x => x.Id == id);
            db.Students.Remove(entity);
            db.SaveChanges();
            return Json("OK", JsonRequestBehavior.AllowGet);
        }

        // Viết hàm thực hiện upload file
        // http://tuanitpro.com/multiple-file-upload-asp-net-mvc
        [HttpPost]
        public JsonResult Upload(HttpPostedFileBase uploadFile)
        {
            try
            {
                if (uploadFile != null)
                {
                    string folderPath = HttpContext.Server.MapPath("~/Content/Files");
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    string filePath = Path.Combine(folderPath, Path.GetFileName(uploadFile.FileName));

                    string extension = Path.GetExtension(uploadFile.FileName);
                    extension = extension.ToLower();
                    string extensionAllowed = ".jpg;.png;.gif;.bmp";
                    if (extensionAllowed.IndexOf(extension) > -1)
                    {
                        uploadFile.SaveAs(filePath);
                        string fileUrl = "/Content/Files/" + uploadFile.FileName;
                        return Json(new { code = 200, message = "Thành công", data = fileUrl, }, JsonRequestBehavior.AllowGet);
                    }


                    return Json(new { code = 400, message = "File không đúng định dạng" }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { code = 400, message = "Upload file thất bại, vui lòng thử lại" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { code = 500, message = "Upload file thất bại, vui lòng thử lại" }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}