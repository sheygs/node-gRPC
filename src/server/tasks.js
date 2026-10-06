export default [
  {
    id: '1',
    title: 'Set up the development environment',
    body: 'Install the supported Node.js version and project dependencies before starting development.',
  },
  {
    id: '2',
    title: 'Start the task service',
    body: 'Launch the gRPC server and confirm it listens on the configured address.',
  },
  {
    id: '3',
    title: 'Connect the HTTP gateway',
    body: 'Start the HTTP gateway and verify it retrieves tasks from the gRPC service.',
  },
  {
    id: '4',
    title: 'Review API documentation',
    body: 'Check that each task endpoint includes request and response examples.',
  },
  {
    id: '5',
    title: 'Plan the next release',
    body: 'Collect upcoming changes and decide which features belong in the next release.',
  },
  {
    id: '6',
    title: 'Verify task creation',
    body: 'Create a task through the HTTP gateway and confirm it appears in the task list.',
  },
  {
    id: '7',
    title: 'Check input validation',
    body: 'Confirm that empty titles and bodies produce useful validation messages.',
  },
  {
    id: '8',
    title: 'Review error responses',
    body: 'Check the responses for missing tasks and an unavailable gRPC service.',
  },
  {
    id: '9',
    title: 'Update onboarding notes',
    body: 'Document how to install dependencies and start both server processes.',
  },
  {
    id: '10',
    title: 'Inspect dependency updates',
    body: 'Review package changes and confirm the lockfile matches the manifest.',
  },
  {
    id: '11',
    title: 'Run integration checks',
    body: 'Verify task creation, editing, deletion, and listing across both transports.',
  },
  {
    id: '12',
    title: 'Review repository boundaries',
    body: 'Confirm that storage operations remain independent of HTTP and gRPC code.',
  },
  {
    id: '13',
    title: 'Test graceful shutdown',
    body: 'Stop each process and confirm its connections and server sockets close.',
  },
  {
    id: '14',
    title: 'Prepare a demo',
    body: 'Choose sample requests that demonstrate the complete task lifecycle.',
  },
  {
    id: '15',
    title: 'Collect user feedback',
    body: 'Record feedback from the demo and turn actionable suggestions into tasks.',
  },
];
