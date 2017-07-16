using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AjaxDemo.Models;
namespace AjaxDemo.Controllers
{
    public class HomeController : Controller
    {
        StudentDbContext db = new StudentDbContext();
         
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

       
        public JsonResult List()
        {
            return null;
        }
      
        public JsonResult Get(int id)
        {
            return null;
        }
        
        public JsonResult Create(Student entity)
        {
            return null;
        }
       
        public JsonResult Update(Student entity)
        {
            return null;
        }
        
        public JsonResult Delete(int id)
        {
            return null;
        }
    }
}