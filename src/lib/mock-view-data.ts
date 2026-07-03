export const sellerRows = [
  { Seller: "Michael Bennett", Type: "Workday Employee", Manager: "Daniel Morris", Status: "Active" },
  { Seller: "Sarah Thompson", Type: "Workday Employee", Manager: "Daniel Morris", Status: "Active" },
  { Seller: "Robert Hayes", Type: "Workday Employee", Manager: "Helen Carter", Status: "Active" }
];

export const roleRows = [
  { Role: "Direct Seller", Behavior: "Split", Rule: "Must total 100%", Status: "Active" },
  { Role: "LPS / Farm Gate", Behavior: "Split With Limit", Rule: "Cannot exceed 100%", Status: "Active" },
  { Role: "Overlay Seller", Behavior: "Additive", Rule: "Does not reduce direct split", Status: "Active" },
  { Role: "Manager Roll-up", Behavior: "Roll-up", Rule: "Team visibility", Status: "Active" }
];

export const customerProductRows = [
  { Customer: "Green Valley Dairy", "Sales Parent": "Green Valley Holdings", "Product Group": "LAND O LAKES Cow's Match Milk Replacer", Status: "Active" },
  { Customer: "North Ridge Feed", "Sales Parent": "North Ridge Cooperative", "Product Group": "Purina RangeLand Pro Mineral", Status: "Active" },
  { Customer: "Prairie View Cooperative", "Sales Parent": "Prairie View Cooperative", "Product Group": "Purina AMPLI-CALF Program", Status: "Active" }
];

export const assignmentRows = [
  { Customer: "Green Valley Dairy", "Product Group": "LAND O LAKES Cow's Match Milk Replacer", Seller: "Michael Bennett", Allocation: "80%", Status: "Active" },
  { Customer: "Green Valley Dairy", "Product Group": "LAND O LAKES Cow's Match Milk Replacer", Seller: "Sarah Thompson", Allocation: "20%", Status: "Active" },
  { Customer: "Lakeside Livestock", "Product Group": "Purina Wind and Rain Mineral", Seller: "Andrew Miller", Allocation: "120%", Status: "Error" }
];

export const approvalRows = [
  { Assignment: "A-1007", Customer: "Green Valley Dairy", Submitted: "Jul 3, 2026", Status: "Submitted" },
  { Assignment: "A-1008", Customer: "Prairie View Cooperative", Submitted: "Jul 3, 2026", Status: "Submitted" }
];

export const historyRows = [
  { Object: "Assignment A-1007", Action: "Submitted", Actor: "Emily Carter", Time: "Jul 3, 2026 09:15", Status: "Submitted" },
  { Object: "Role Direct Seller", Action: "Updated", Actor: "Admin", Time: "Jul 3, 2026 08:40", Status: "Approved" }
];
