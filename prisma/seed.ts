import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const date = (value: string) => new Date(`${value}T00:00:00.000Z`);

async function reset() {
  await prisma.creditPreviewResult.deleteMany();
  await prisma.mockInvoice.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.approvalHistory.deleteMany();
  await prisma.validationResult.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.productGroup.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.role.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.demoUser.deleteMany();
}

async function main() {
  await reset();

  const admin = await prisma.demoUser.create({
    data: {
      name: "Emily Carter",
      email: "emily.carter@example.com",
      role: "SALES_COMP_ADMIN"
    }
  });

  const managerUser = await prisma.demoUser.create({
    data: {
      name: "Daniel Morris",
      email: "daniel.morris@example.com",
      role: "SALES_MANAGER"
    }
  });

  const financeUser = await prisma.demoUser.create({
    data: {
      name: "Laura Wilson",
      email: "laura.wilson@example.com",
      role: "FINANCE"
    }
  });

  const daniel = await prisma.seller.create({
    data: {
      sellerCode: "SEL-100",
      workdayEmployeeId: "WD-100",
      name: "Daniel Morris",
      email: "daniel.morris@example.com",
      employeeType: "WORKDAY_EMPLOYEE",
      isFullTime: true,
      active: true,
      effectiveStartDate: date("2024-01-01")
    }
  });

  const helen = await prisma.seller.create({
    data: {
      sellerCode: "SEL-101",
      workdayEmployeeId: "WD-101",
      name: "Helen Carter",
      email: "helen.carter@example.com",
      employeeType: "WORKDAY_EMPLOYEE",
      isFullTime: true,
      active: true,
      effectiveStartDate: date("2024-01-01")
    }
  });

  const sellers = await Promise.all([
    prisma.seller.create({
      data: {
        sellerCode: "SEL-201",
        workdayEmployeeId: "WD-201",
        name: "Michael Bennett",
        email: "michael.bennett@example.com",
        employeeType: "WORKDAY_EMPLOYEE",
        isFullTime: true,
        managerSellerId: daniel.id,
        active: true,
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.seller.create({
      data: {
        sellerCode: "SEL-202",
        workdayEmployeeId: "WD-202",
        name: "Sarah Thompson",
        email: "sarah.thompson@example.com",
        employeeType: "WORKDAY_EMPLOYEE",
        isFullTime: true,
        managerSellerId: daniel.id,
        active: true,
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.seller.create({
      data: {
        sellerCode: "SEL-203",
        workdayEmployeeId: "WD-203",
        name: "Robert Hayes",
        email: "robert.hayes@example.com",
        employeeType: "WORKDAY_EMPLOYEE",
        isFullTime: true,
        managerSellerId: helen.id,
        active: true,
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.seller.create({
      data: {
        sellerCode: "SEL-204",
        workdayEmployeeId: "WD-204",
        name: "Jennifer Brooks",
        email: "jennifer.brooks@example.com",
        employeeType: "WORKDAY_EMPLOYEE",
        isFullTime: true,
        managerSellerId: helen.id,
        active: true,
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.seller.create({
      data: {
        sellerCode: "SEL-205",
        workdayEmployeeId: "WD-205",
        name: "Andrew Miller",
        email: "andrew.miller@example.com",
        employeeType: "LOCAL_HIRE",
        isFullTime: false,
        managerSellerId: daniel.id,
        active: true,
        effectiveStartDate: date("2024-04-01")
      }
    }),
    prisma.seller.create({
      data: {
        sellerCode: "SEL-206",
        workdayEmployeeId: "WD-206",
        name: "Mark Reynolds",
        email: "mark.reynolds@example.com",
        employeeType: "WORKDAY_EMPLOYEE",
        isFullTime: true,
        managerSellerId: helen.id,
        active: false,
        effectiveStartDate: date("2023-01-01"),
        effectiveEndDate: date("2026-03-31")
      }
    })
  ]);

  const [michael, sarah, robert, jennifer, andrew, mark] = sellers;

  const directRole = await prisma.role.create({
    data: {
      name: "Direct Seller",
      category: "DIRECT_SELLER",
      behavior: "SPLIT",
      splitRequiredTotal: 100,
      isEligibleForCredit: true,
      effectiveStartDate: date("2024-01-01")
    }
  });

  const lpsRole = await prisma.role.create({
    data: {
      name: "LPS / Farm Gate Seller",
      category: "LPS_FARM_GATE_SELLER",
      behavior: "SPLIT_WITH_LIMIT",
      splitMaximum: 100,
      isEligibleForCredit: true,
      effectiveStartDate: date("2024-01-01")
    }
  });

  const overlayRole = await prisma.role.create({
    data: {
      name: "Overlay Seller",
      category: "OVERLAY_SELLER",
      behavior: "ADDITIVE",
      isEligibleForCredit: true,
      effectiveStartDate: date("2024-01-01")
    }
  });

  const managerRole = await prisma.role.create({
    data: {
      name: "Manager Roll-up",
      category: "MANAGER_ROLLUP",
      behavior: "ROLLUP",
      isEligibleForCredit: false,
      effectiveStartDate: date("2024-01-01")
    }
  });

  await prisma.role.create({
    data: {
      name: "Future Configurable Role",
      category: "FUTURE_ROLE",
      behavior: "CONFIGURABLE",
      isEligibleForCredit: false,
      active: false,
      effectiveStartDate: date("2024-01-01")
    }
  });

  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        customerCode: "CUST-1001",
        sapCustomerId: "SAP-1001",
        salesforceAccountId: "SF-1001",
        name: "Green Valley Dairy",
        salesParent: "Green Valley Holdings",
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.customer.create({
      data: {
        customerCode: "CUST-1002",
        sapCustomerId: "SAP-1002",
        salesforceAccountId: "SF-1002",
        name: "Meadowbrook Farms",
        salesParent: "Meadowbrook Group",
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.customer.create({
      data: {
        customerCode: "CUST-1003",
        sapCustomerId: "SAP-1003",
        salesforceAccountId: "SF-1003",
        name: "North Ridge Feed",
        salesParent: "North Ridge Cooperative",
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.customer.create({
      data: {
        customerCode: "CUST-1004",
        sapCustomerId: "SAP-1004",
        salesforceAccountId: "SF-1004",
        name: "Prairie View Cooperative",
        salesParent: "Prairie View Cooperative",
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.customer.create({
      data: {
        customerCode: "CUST-1005",
        sapCustomerId: "SAP-1005",
        salesforceAccountId: "SF-1005",
        name: "Lakeside Livestock",
        salesParent: "Lakeside Ag Partners",
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.customer.create({
      data: {
        customerCode: "CUST-1006",
        sapCustomerId: "SAP-1006",
        salesforceAccountId: "SF-1006",
        name: "Cedar Hollow Dairy",
        salesParent: "Cedar Hollow Farms",
        effectiveStartDate: date("2024-01-01")
      }
    })
  ]);

  const productGroups = await Promise.all([
    prisma.productGroup.create({
      data: {
        productGroupCode: "PG-AMS-COWS-MATCH",
        externalProductGroupId: "LOL-AMS-COWS-MATCH",
        name: "LAND O LAKES Cow's Match Milk Replacer",
        metricType: "BOTH",
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.productGroup.create({
      data: {
        productGroupCode: "PG-AMS-AMPLIFIER-MAX",
        externalProductGroupId: "LOL-AMS-AMPLIFIER-MAX",
        name: "LAND O LAKES Amplifier Max Milk Replacer",
        metricType: "BOTH",
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.productGroup.create({
      data: {
        productGroupCode: "PG-AMS-CALF-INSURE",
        externalProductGroupId: "LOL-AMS-CALF-INSURE",
        name: "LAND O LAKES Calf Insure",
        metricType: "AMOUNT",
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.productGroup.create({
      data: {
        productGroupCode: "PG-AMS-PASTEURIZED-BALANCER",
        externalProductGroupId: "LOL-AMS-PASTEURIZED-BALANCER",
        name: "LAND O LAKES Pasteurized Milk Balancer",
        metricType: "BOTH",
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.productGroup.create({
      data: {
        productGroupCode: "PG-PURINA-WIND-RAIN",
        externalProductGroupId: "PURINA-WIND-RAIN",
        name: "Purina Wind and Rain Mineral",
        metricType: "BOTH",
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.productGroup.create({
      data: {
        productGroupCode: "PG-PURINA-RANGELAND-PRO",
        externalProductGroupId: "PURINA-RANGELAND-PRO",
        name: "Purina RangeLand Pro Mineral",
        metricType: "BOTH",
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.productGroup.create({
      data: {
        productGroupCode: "PG-PURINA-ALL-SEASONS",
        externalProductGroupId: "PURINA-ALL-SEASONS",
        name: "Purina All Seasons Cattle Nutrition",
        metricType: "BOTH",
        effectiveStartDate: date("2024-01-01")
      }
    }),
    prisma.productGroup.create({
      data: {
        productGroupCode: "PG-PURINA-AMPLI-CALF",
        externalProductGroupId: "PURINA-AMPLI-CALF",
        name: "Purina AMPLI-CALF Program",
        metricType: "BOTH",
        effectiveStartDate: date("2024-01-01")
      }
    })
  ]);

  const [
    greenValley,
    meadowbrook,
    northRidge,
    prairieView,
    lakeside,
    cedarHollow
  ] = customers;
  const [
    cowsMatch,
    amplifierMax,
    calfInsure,
    milkBalancer,
    windRain,
    rangeLand,
    allSeasons,
    ampliCalf
  ] = productGroups;

  const activeA = await prisma.assignment.create({
    data: {
      assignmentNumber: "A-1001",
      customerId: greenValley.id,
      productGroupId: cowsMatch.id,
      sellerId: michael.id,
      roleId: directRole.id,
      allocationPercent: 80,
      startDate: date("2026-01-01"),
      status: "ACTIVE",
      reasonNotes: "Primary direct seller for calf nutrition program.",
      createdByUserId: admin.id,
      updatedByUserId: admin.id
    }
  });

  const activeB = await prisma.assignment.create({
    data: {
      assignmentNumber: "A-1002",
      customerId: greenValley.id,
      productGroupId: cowsMatch.id,
      sellerId: sarah.id,
      roleId: directRole.id,
      allocationPercent: 20,
      startDate: date("2026-01-01"),
      status: "ACTIVE",
      reasonNotes: "Secondary direct seller split.",
      createdByUserId: admin.id,
      updatedByUserId: admin.id
    }
  });

  const submitted = await prisma.assignment.create({
    data: {
      assignmentNumber: "A-1003",
      customerId: meadowbrook.id,
      productGroupId: amplifierMax.id,
      sellerId: robert.id,
      roleId: directRole.id,
      allocationPercent: 100,
      startDate: date("2026-07-01"),
      status: "SUBMITTED",
      reasonNotes: "New territory ownership effective July.",
      createdByUserId: admin.id,
      updatedByUserId: admin.id
    }
  });

  const draft = await prisma.assignment.create({
    data: {
      assignmentNumber: "A-1004",
      customerId: prairieView.id,
      productGroupId: allSeasons.id,
      sellerId: jennifer.id,
      roleId: directRole.id,
      allocationPercent: 70,
      startDate: date("2026-08-01"),
      status: "DRAFT",
      reasonNotes: "Draft split pending second seller.",
      createdByUserId: admin.id,
      updatedByUserId: admin.id
    }
  });

  const rejected = await prisma.assignment.create({
    data: {
      assignmentNumber: "A-1005",
      customerId: lakeside.id,
      productGroupId: windRain.id,
      sellerId: andrew.id,
      roleId: lpsRole.id,
      allocationPercent: 120,
      startDate: date("2026-06-01"),
      status: "REJECTED",
      reasonNotes: "Rejected because LPS allocation exceeded allowed maximum.",
      createdByUserId: admin.id,
      updatedByUserId: managerUser.id
    }
  });

  const expired = await prisma.assignment.create({
    data: {
      assignmentNumber: "A-1006",
      customerId: cedarHollow.id,
      productGroupId: milkBalancer.id,
      sellerId: mark.id,
      roleId: directRole.id,
      allocationPercent: 100,
      startDate: date("2025-01-01"),
      endDate: date("2026-03-31"),
      status: "EXPIRED",
      reasonNotes: "Closed when seller became inactive.",
      createdByUserId: admin.id,
      updatedByUserId: admin.id
    }
  });

  const overlay = await prisma.assignment.create({
    data: {
      assignmentNumber: "A-1007",
      customerId: northRidge.id,
      productGroupId: rangeLand.id,
      sellerId: sarah.id,
      roleId: overlayRole.id,
      allocationPercent: 25,
      startDate: date("2026-01-01"),
      status: "APPROVED",
      reasonNotes: "Overlay support for strategic account growth.",
      createdByUserId: admin.id,
      updatedByUserId: managerUser.id
    }
  });

  const managerRollup = await prisma.assignment.create({
    data: {
      assignmentNumber: "A-1008",
      customerId: northRidge.id,
      productGroupId: rangeLand.id,
      sellerId: daniel.id,
      roleId: managerRole.id,
      allocationPercent: 0,
      startDate: date("2026-01-01"),
      status: "APPROVED",
      reasonNotes: "Manager roll-up visibility for team assignment.",
      createdByUserId: admin.id,
      updatedByUserId: managerUser.id
    }
  });

  const directShortfall = await prisma.assignment.create({
    data: {
      assignmentNumber: "A-1009",
      customerId: prairieView.id,
      productGroupId: ampliCalf.id,
      sellerId: jennifer.id,
      roleId: directRole.id,
      allocationPercent: 80,
      startDate: date("2026-07-01"),
      status: "SUBMITTED",
      reasonNotes: "Intentionally incomplete direct split for validation demo.",
      createdByUserId: admin.id,
      updatedByUserId: admin.id
    }
  });

  await prisma.validationResult.createMany({
    data: [
      {
        assignmentId: activeA.id,
        validationGroupKey: "CUST-1001|PG-AMS-COWS-MATCH|2026-01-01",
        ruleCode: "DIRECT_SPLIT_TOTAL",
        severity: "INFO",
        message: "Direct seller split is 100%."
      },
      {
        assignmentId: activeB.id,
        validationGroupKey: "CUST-1001|PG-AMS-COWS-MATCH|2026-01-01",
        ruleCode: "DIRECT_SPLIT_TOTAL",
        severity: "INFO",
        message: "Direct seller split is 100%."
      },
      {
        assignmentId: rejected.id,
        validationGroupKey: "CUST-1005|PG-PURINA-WIND-RAIN|2026-06-01",
        ruleCode: "LPS_SPLIT_MAX",
        severity: "ERROR",
        message: "LPS allocation is 120%. Reduce to 100% or less."
      },
      {
        assignmentId: overlay.id,
        validationGroupKey: "CUST-1003|PG-PURINA-RANGELAND-PRO|2026-01-01",
        ruleCode: "OVERLAY_ADDITIVE",
        severity: "INFO",
        message: "Overlay role is additive and will not reduce direct seller split."
      },
      {
        assignmentId: directShortfall.id,
        validationGroupKey: "CUST-1004|PG-PURINA-AMPLI-CALF|2026-07-01",
        ruleCode: "DIRECT_SPLIT_TOTAL",
        severity: "ERROR",
        message: "Direct seller split is 80%. Adjust to 100% before approval."
      },
      {
        assignmentId: expired.id,
        validationGroupKey: "CUST-1006|PG-AMS-PASTEURIZED-BALANCER|2026-03-31",
        ruleCode: "INACTIVE_SELLER",
        severity: "WARNING",
        message: "Seller is inactive for future assignment dates."
      }
    ]
  });

  await prisma.approvalHistory.createMany({
    data: [
      {
        assignmentId: submitted.id,
        approverUserId: managerUser.id,
        decision: "SUBMITTED",
        comments: "Ready for July territory review.",
        decidedAt: date("2026-07-03")
      },
      {
        assignmentId: activeA.id,
        approverUserId: managerUser.id,
        decision: "APPROVED",
        comments: "Approved for POC demo baseline.",
        decidedAt: date("2026-01-02")
      },
      {
        assignmentId: activeB.id,
        approverUserId: managerUser.id,
        decision: "APPROVED",
        comments: "Approved for POC demo baseline.",
        decidedAt: date("2026-01-02")
      },
      {
        assignmentId: rejected.id,
        approverUserId: managerUser.id,
        decision: "REJECTED",
        comments: "LPS allocation exceeds 100%.",
        decidedAt: date("2026-06-15")
      }
    ]
  });

  await prisma.auditLog.createMany({
    data: [
      {
        objectType: "Assignment",
        objectId: activeA.id,
        action: "CREATE",
        actorUserId: admin.id,
        newValueJson: JSON.stringify({ assignmentNumber: "A-1001", allocationPercent: 80 }),
        comment: "Created active direct seller split."
      },
      {
        objectType: "Assignment",
        objectId: submitted.id,
        action: "SUBMIT",
        actorUserId: admin.id,
        newValueJson: JSON.stringify({ status: "SUBMITTED" }),
        comment: "Submitted for manager review."
      },
      {
        objectType: "Assignment",
        objectId: rejected.id,
        action: "REJECT",
        actorUserId: managerUser.id,
        oldValueJson: JSON.stringify({ status: "SUBMITTED" }),
        newValueJson: JSON.stringify({ status: "REJECTED" }),
        comment: "Rejected due to LPS over-allocation."
      },
      {
        objectType: "Assignment",
        objectId: draft.id,
        action: "CREATE",
        actorUserId: admin.id,
        newValueJson: JSON.stringify({ assignmentNumber: "A-1004", status: "DRAFT" }),
        comment: "Created draft assignment pending second seller."
      },
      {
        objectType: "Export",
        objectId: "approved-assignments",
        action: "EXPORT",
        actorUserId: financeUser.id,
        comment: "Demo export event for approved assignments."
      }
    ]
  });

  const invoices = await Promise.all([
    prisma.mockInvoice.create({
      data: {
        invoiceNumber: "INV-9001",
        customerId: greenValley.id,
        productGroupId: cowsMatch.id,
        quantity: 100,
        quantityUnit: "tons",
        amount: 10000,
        invoiceDate: date("2026-07-01")
      }
    }),
    prisma.mockInvoice.create({
      data: {
        invoiceNumber: "INV-9002",
        customerId: northRidge.id,
        productGroupId: rangeLand.id,
        quantity: 48,
        quantityUnit: "tons",
        amount: 7200,
        invoiceDate: date("2026-07-01")
      }
    }),
    prisma.mockInvoice.create({
      data: {
        invoiceNumber: "INV-9003",
        customerId: meadowbrook.id,
        productGroupId: amplifierMax.id,
        quantity: 75,
        quantityUnit: "tons",
        amount: 11850,
        invoiceDate: date("2026-07-15")
      }
    }),
    prisma.mockInvoice.create({
      data: {
        invoiceNumber: "INV-9004",
        customerId: cedarHollow.id,
        productGroupId: calfInsure.id,
        quantity: 0,
        quantityUnit: "each",
        amount: 3600,
        invoiceDate: date("2026-07-15")
      }
    })
  ]);

  await prisma.creditPreviewResult.createMany({
    data: [
      {
        mockInvoiceId: invoices[0].id,
        assignmentId: activeA.id,
        sellerId: michael.id,
        roleId: directRole.id,
        allocationPercent: 80,
        creditedQuantity: 80,
        creditedAmount: 8000
      },
      {
        mockInvoiceId: invoices[0].id,
        assignmentId: activeB.id,
        sellerId: sarah.id,
        roleId: directRole.id,
        allocationPercent: 20,
        creditedQuantity: 20,
        creditedAmount: 2000
      },
      {
        mockInvoiceId: invoices[1].id,
        assignmentId: overlay.id,
        sellerId: sarah.id,
        roleId: overlayRole.id,
        allocationPercent: 25,
        creditedQuantity: 12,
        creditedAmount: 1800
      },
      {
        mockInvoiceId: invoices[1].id,
        assignmentId: managerRollup.id,
        sellerId: daniel.id,
        roleId: managerRole.id,
        allocationPercent: 0,
        creditedQuantity: 0,
        creditedAmount: 0
      }
    ]
  });

  console.log("Seed data loaded for Feed Sales Incentive POC.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
