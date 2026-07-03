-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sellerCode" TEXT NOT NULL,
    "workdayEmployeeId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "employeeType" TEXT NOT NULL,
    "isFullTime" BOOLEAN NOT NULL DEFAULT true,
    "managerSellerId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "effectiveStartDate" DATETIME NOT NULL,
    "effectiveEndDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Seller_managerSellerId_fkey" FOREIGN KEY ("managerSellerId") REFERENCES "Seller" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "behavior" TEXT NOT NULL,
    "splitRequiredTotal" DECIMAL,
    "splitMaximum" DECIMAL,
    "isEligibleForCredit" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "effectiveStartDate" DATETIME NOT NULL,
    "effectiveEndDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerCode" TEXT NOT NULL,
    "sapCustomerId" TEXT,
    "salesforceAccountId" TEXT,
    "name" TEXT NOT NULL,
    "salesParent" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "effectiveStartDate" DATETIME NOT NULL,
    "effectiveEndDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProductGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productGroupCode" TEXT NOT NULL,
    "externalProductGroupId" TEXT,
    "name" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "effectiveStartDate" DATETIME NOT NULL,
    "effectiveEndDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assignmentNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productGroupId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "allocationPercent" DECIMAL NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "reasonNotes" TEXT,
    "supersedesAssignmentId" TEXT,
    "createdByUserId" TEXT,
    "updatedByUserId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Assignment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_productGroupId_fkey" FOREIGN KEY ("productGroupId") REFERENCES "ProductGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_supersedesAssignmentId_fkey" FOREIGN KEY ("supersedesAssignmentId") REFERENCES "Assignment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Assignment_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "DemoUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Assignment_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "DemoUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ValidationResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assignmentId" TEXT NOT NULL,
    "validationGroupKey" TEXT NOT NULL,
    "ruleCode" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ValidationResult_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ApprovalHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assignmentId" TEXT NOT NULL,
    "approverUserId" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "comments" TEXT,
    "decidedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApprovalHistory_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ApprovalHistory_approverUserId_fkey" FOREIGN KEY ("approverUserId") REFERENCES "DemoUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "objectType" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorUserId" TEXT,
    "oldValueJson" TEXT,
    "newValueJson" TEXT,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "DemoUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MockInvoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productGroupId" TEXT NOT NULL,
    "quantity" DECIMAL NOT NULL,
    "quantityUnit" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "invoiceDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MockInvoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MockInvoice_productGroupId_fkey" FOREIGN KEY ("productGroupId") REFERENCES "ProductGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreditPreviewResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mockInvoiceId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "allocationPercent" DECIMAL NOT NULL,
    "creditedQuantity" DECIMAL,
    "creditedAmount" DECIMAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditPreviewResult_mockInvoiceId_fkey" FOREIGN KEY ("mockInvoiceId") REFERENCES "MockInvoice" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CreditPreviewResult_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CreditPreviewResult_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CreditPreviewResult_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DemoUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "Seller_sellerCode_key" ON "Seller"("sellerCode");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_workdayEmployeeId_key" ON "Seller"("workdayEmployeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");

-- CreateIndex
CREATE INDEX "Seller_managerSellerId_idx" ON "Seller"("managerSellerId");

-- CreateIndex
CREATE INDEX "Seller_active_idx" ON "Seller"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Role_category_idx" ON "Role"("category");

-- CreateIndex
CREATE INDEX "Role_behavior_idx" ON "Role"("behavior");

-- CreateIndex
CREATE INDEX "Role_active_idx" ON "Role"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerCode_key" ON "Customer"("customerCode");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_sapCustomerId_key" ON "Customer"("sapCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_salesforceAccountId_key" ON "Customer"("salesforceAccountId");

-- CreateIndex
CREATE INDEX "Customer_salesParent_idx" ON "Customer"("salesParent");

-- CreateIndex
CREATE INDEX "Customer_active_idx" ON "Customer"("active");

-- CreateIndex
CREATE UNIQUE INDEX "ProductGroup_productGroupCode_key" ON "ProductGroup"("productGroupCode");

-- CreateIndex
CREATE UNIQUE INDEX "ProductGroup_externalProductGroupId_key" ON "ProductGroup"("externalProductGroupId");

-- CreateIndex
CREATE INDEX "ProductGroup_metricType_idx" ON "ProductGroup"("metricType");

-- CreateIndex
CREATE INDEX "ProductGroup_active_idx" ON "ProductGroup"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_assignmentNumber_key" ON "Assignment"("assignmentNumber");

-- CreateIndex
CREATE INDEX "Assignment_customerId_productGroupId_startDate_endDate_idx" ON "Assignment"("customerId", "productGroupId", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "Assignment_sellerId_roleId_idx" ON "Assignment"("sellerId", "roleId");

-- CreateIndex
CREATE INDEX "Assignment_status_idx" ON "Assignment"("status");

-- CreateIndex
CREATE INDEX "Assignment_createdByUserId_idx" ON "Assignment"("createdByUserId");

-- CreateIndex
CREATE INDEX "Assignment_updatedByUserId_idx" ON "Assignment"("updatedByUserId");

-- CreateIndex
CREATE INDEX "ValidationResult_validationGroupKey_idx" ON "ValidationResult"("validationGroupKey");

-- CreateIndex
CREATE INDEX "ValidationResult_severity_idx" ON "ValidationResult"("severity");

-- CreateIndex
CREATE INDEX "ApprovalHistory_assignmentId_idx" ON "ApprovalHistory"("assignmentId");

-- CreateIndex
CREATE INDEX "ApprovalHistory_approverUserId_idx" ON "ApprovalHistory"("approverUserId");

-- CreateIndex
CREATE INDEX "ApprovalHistory_decision_idx" ON "ApprovalHistory"("decision");

-- CreateIndex
CREATE INDEX "AuditLog_objectType_objectId_idx" ON "AuditLog"("objectType", "objectId");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_idx" ON "AuditLog"("actorUserId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE UNIQUE INDEX "MockInvoice_invoiceNumber_key" ON "MockInvoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "MockInvoice_customerId_productGroupId_invoiceDate_idx" ON "MockInvoice"("customerId", "productGroupId", "invoiceDate");

-- CreateIndex
CREATE INDEX "CreditPreviewResult_mockInvoiceId_idx" ON "CreditPreviewResult"("mockInvoiceId");

-- CreateIndex
CREATE INDEX "CreditPreviewResult_assignmentId_idx" ON "CreditPreviewResult"("assignmentId");

-- CreateIndex
CREATE INDEX "CreditPreviewResult_sellerId_idx" ON "CreditPreviewResult"("sellerId");

-- CreateIndex
CREATE UNIQUE INDEX "DemoUser_email_key" ON "DemoUser"("email");

-- CreateIndex
CREATE INDEX "DemoUser_role_idx" ON "DemoUser"("role");

-- CreateIndex
CREATE INDEX "DemoUser_active_idx" ON "DemoUser"("active");
