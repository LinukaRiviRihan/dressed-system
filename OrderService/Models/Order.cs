namespace OrderService.Models
{
    public class Order
    {
        public Guid Id { get; set; }
        public Guid QuoteId { get; set; }
        public Guid DesignId { get; set; }
        public string SupplierName { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public DateTime OrderDate { get; set; }
    }
}