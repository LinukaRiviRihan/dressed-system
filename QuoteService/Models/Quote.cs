namespace QuoteService.Models
{
    public class Quote
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid DesignId { get; set; }
        public string SupplierName { get; set; }
        public decimal Amount { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}