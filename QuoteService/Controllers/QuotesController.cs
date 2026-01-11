using Microsoft.AspNetCore.Mvc;
using QuoteService.Models;

namespace QuoteService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotesController : ControllerBase
    {
        private static readonly List<Quote> _quotes = new();

        [HttpPost]
        public IActionResult SubmitQuote([FromBody] Quote quote)
        {
            quote.Id = Guid.NewGuid();
            quote.CreatedAt = DateTime.UtcNow;
            _quotes.Add(quote);
            return Ok(quote);
        }

        [HttpGet("design/{designId}")]
        public IActionResult GetQuotes(Guid designId)
        {
            var quotes = _quotes
                .Where(q => q.DesignId == designId)
                .OrderByDescending(q => q.CreatedAt)
                .ToList();
            return Ok(quotes);
        }
    }
}