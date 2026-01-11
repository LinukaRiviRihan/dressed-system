using Microsoft.AspNetCore.Mvc;
using DesignService.Dtos;

namespace DesignService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DesignsController : ControllerBase
    {
        private static readonly List<dynamic> _designs = new();
        private static readonly List<string> _categories = new() { "Men", "Women", "Kids", "Unisex" };

        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            return Ok(_categories);
        }

        [HttpGet]
        public IActionResult GetDesigns()
        {
            return Ok(_designs);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDesign([FromForm] CreateDesignDto input)
        {
            string fileUrl = "";

            if (input.File != null && input.File.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + input.File.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await input.File.CopyToAsync(stream);
                }

                fileUrl = "/uploads/" + uniqueFileName;
            }

            var design = new
            {
                Id = Guid.NewGuid(),
                input.Name,
                input.Category,
                input.Description,
                ImageUrl = fileUrl,
                CreatedAt = DateTime.UtcNow
            };

            _designs.Add(design);
            return Ok(design);
        }
    }
}