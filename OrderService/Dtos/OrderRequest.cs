namespace OrderService.DTOs
{
    public class OrderRequest
    {
        public Guid QuoteId { get; set; }
        public Guid DesignId { get; set; }
        public string SupplierName { get; set; }
        public decimal Amount { get; set; }
    }
}