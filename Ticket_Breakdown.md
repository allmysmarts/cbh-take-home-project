# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

In order to add a new feature for Facilities to save their own custom ids for each Agent, we need to add a new page in which Facilities can register specific Agents with custom id, they would like to work with. (this will bring a new additional process for Facilities.)

For the feature, we need to add a new pivot table, add new functions and update the existing ones. I would like to break this ticket down into the following tickets:

- Add a new pivot table `facility_agent`
We can determine how to add this table into database. (by migration or SQL statements)

| Column | Description |
| ------ |    ------   |
| `facility_id` | foreign key to `Facilities` table |
| `agent_id` | foreign key to `Agents` table |
| `custom_id` | type: `INT`, unique value for each `facility_id` |


- Add new function `addNewAgent(facilityId, agentId, customId)`
It validates parameters, and if passed, then it will add a new record into `facility_agent` table.
It can be used from the front end by the Facilities to assign new custom id into any specific Agent.

- Add new function `getAllBelongedAgentsByFacility(facilityId)`
It returns a list of Agents that were registered by the Facility already, and were assigned `custom id`.
It can be used from the front end while booking a Agent for any Shift by Facility.
Now it may show all global Agents to the Facility, but with this change, Facility will only see the list of Agents(registered already).

- Update `getShiftsByFacility(facilityId)`
With the `SQL Left JOIN`, we can make it to return `custom_id` also.

- Update `generateReport`
Instead of Agent id, we will use `custom_id` in PDF conversion.
