using System;
using TrafikCezasiApp;

namespace proje_deneme
{
    public class TrafficFine
    {
        public int Id { get; set; }
        public int DriverId { get; set; }
        public string Reason { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public bool IsPaid { get; set; }
        public Driver Driver { get; set; }
    }
}