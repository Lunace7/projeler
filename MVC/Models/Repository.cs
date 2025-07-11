using System.Collections;
using Dersler.Models;

namespace Dersler.Models
{
    public static class Repository
    {
        private static List<Candidate> applictions = new();
        public static IEnumerable<Candidate> Applications => applictions;

        public static void Add(Candidate candidate)
        {
            applictions.Add(candidate);
        }
    }
}