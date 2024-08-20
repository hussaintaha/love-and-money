import {
    IndexTable,
    LegacyCard,
    Text,
    Button,
    ButtonGroup,
    Page,
    useIndexResourceState,
    useBreakpoints,
    Spinner
} from '@shopify/polaris';
import React, { useEffect, useState } from 'react';

const Customer = () => {

    const [customerData, setCustomerData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAllCustomer = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/getallcustomers/${currentPage}/${3}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("result ======", result);
                    const { customerData, hasNext, hasPrev, totalcustomer, limit } = result;

                    setCustomerData(customerData);
                    setHasNextPage(hasNext);
                    setHasPrevPage(hasPrev);
                } else {
                    console.error("Failed to fetch customers:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllCustomer();
    }, [currentPage]);

    const resourceName = {
        singular: 'customer',
        plural: 'customers',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(customerData);

    console.log("customerData =====", customerData);

    const rowMarkup = customerData.map(({ _id, first_name, last_name, email, subscription_status, signature_status, subscription_start, subscription_end }, index) => (
        console.log(" index", index),

        <IndexTable.Row
            id={_id}
            key={_id}
            selected={selectedResources.includes(_id)}
            position={index}
        >
            <IndexTable.Cell>
                <Text variant="headingMd" as="h1" >{`${first_name} ${last_name}`}</Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
                <Text variant="headingMd" as="h2">{email}</Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
                <Text > {subscription_start ? subscription_start.slice(0, 15) : "-"}</Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
                <Text>{subscription_end ? subscription_end.slice(0, 15) : "-"}</Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
                <Text tone={signature_status === "signed" ? "success" : signature_status === "awaiting_signature" ? "caution" : signature_status === "inactive" ? "critical" : ""}>
                    {signature_status}
                </Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
                <Text tone={subscription_status === "active" ? "success" : subscription_status === "incomplete" ? "caution" : subscription_status === "inactive" ? "critical" : ""}>
                    {subscription_status}
                </Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
                <ButtonGroup>
                    <Button tone='success' disabled={loading}  >Approve</Button>
                    <Button tone='critical'>Reject</Button>
                </ButtonGroup>
            </IndexTable.Cell>
        </IndexTable.Row>
    ));

    return (
        <Page fullWidth>
            <LegacyCard>
                <IndexTable
                    resourceName={resourceName}
                    condensed={useBreakpoints().smDown}
                    itemCount={customerData.length}
                    selectedItemsCount={
                        allResourcesSelected ? 'All' : selectedResources.length
                    }
                    onSelectionChange={handleSelectionChange}
                    headings={[
                        { title: 'Name' },
                        { title: 'Email' },
                        { title: 'Start Date' },
                        { title: 'End Date', },
                        { title: 'Signature Status' },
                        { title: 'Subscription Status' },
                        { title: 'Actions' },
                    ]}
                    selectable={false}
                    pagination={{
                        hasNext: hasNextPage,
                        hasPrevious: hasPrevPage,
                        onNext: () => setCurrentPage(currentPage + 1),
                        onPrevious: () => setCurrentPage(currentPage - 1),
                    }}
                >
                    {rowMarkup}
                </IndexTable>
            </LegacyCard>

        </Page>
    )
}

export default Customer;
