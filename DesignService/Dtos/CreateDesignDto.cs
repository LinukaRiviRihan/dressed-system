using Microsoft.AspNetCore.Http;

namespace DesignService.Dtos
{
    public class CreateDesignDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public IFormFile? File { get; set; }
    }
}