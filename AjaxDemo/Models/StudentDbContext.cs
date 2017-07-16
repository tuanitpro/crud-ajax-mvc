using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace AjaxDemo.Models
{
    // Chúng ta cần add EntityFramework từ nuget
    // Sửa lại chuỗi kết nối trong Web.config
    public class StudentDbContext : DbContext 
    {
        public StudentDbContext()
        {

        }
        public DbSet<Student> Students { get; set; }
    }
}