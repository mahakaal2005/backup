---
trigger: always_on
---

<AndroidDeveloperAgent>
  <Standards>
    <Author>Philipp Lackner</Author>
    <KeyPrinciples>
      <Principle>Strict coding standards</Principle>
      <Principle>Clean Architecture</Principle>
      <Principle>MVVM</Principle>
      <Principle>Feature-First Structure</Principle>
      <Principle>Domain-Centric Logic</Principle>
    </KeyPrinciples>
  </Standards>

  <Context7Rule>
    <Description>
      Always use Context7 MCP for library/API documentation, code generation, setup, or configuration without explicit user prompting.
    </Description>
  </Context7Rule>

  <VibeCheckRule>
    <Purpose>Prevent tunnel vision, validate assumptions, ensure correctness</Purpose>
    <MustUse>
      <Phase>Beginning of Task</Phase>
      <Phase>Planning</Phase>
      <Phase>Completion</Phase>
    </MustUse>
  </VibeCheckRule>

  <SemgrepRule>
    <Description>
      Use semgrep_scan after development phases to check security and code quality.
    </Description>
  </SemgrepRule>

  <SequentialThinkingRule>
    <Description>
      Use sequentialthinking for analyzing complex tasks, planning, or debugging.
    </Description>
  </SequentialThinkingRule>

  <Architecture>
    <CorePrinciple>Clean Architecture + MVVM</CorePrinciple>
    <Layers>
      <Presentation>
        <Description>UI + ViewModels, no business logic</Description>
      </Presentation>
      <Domain>
        <Description>Pure Kotlin, business logic, use cases, entities</Description>
      </Domain>
      <Data>
        <Description>Repository implementations, DB/API, DTO mapping</Description>
      </Data>
    </Layers>

    <PackageStructure>
      <Root>Feature-First</Root>
      <Example>
        <Feature>
          <Name>feature_note</Name>
          <Presentation>UI + ViewModels</Presentation>
          <Domain>UseCases + Models + RepositoryInterfaces</Domain>
          <Data>RepositoryImplementations + DTOs + DataSources</Data>
        </Feature>
      </Example>
    </PackageStructure>
  </Architecture>

  <DI>
    <Framework>Dagger Hilt</Framework>
    <Modules>
      <ModuleType>SingletonComponent</ModuleType>
    </Modules>
    <Injection>
      <ConstructorInjection>true</ConstructorInjection>
      <LazyInjection>Allowed when runtime values not ready</LazyInjection>
      <ViewModels>@HiltViewModel</ViewModels>
    </Injection>
  </DI>

  <Domain>
    <UseCases>
      <Principles>
        <SingleResponsibility>true</SingleResponsibility>
        <OperatorInvoke>true</OperatorInvoke>
        <WrapperClasses>Allowed for grouping use cases</WrapperClasses>
      </Principles>
      <BusinessLogicLocation>Domain</BusinessLogicLocation>
    </UseCases>
  </Domain>

  <MVVM>
    <StateManagement>
      <Rule>Single Source of Truth</Rule>
      <StateFlow>true</StateFlow>
      <Events>Sealed Event Classes</Events>
      <SideEffects>
        <Channel>true</Channel>
      </SideEffects>
    </StateManagement>
  </MVVM>

  <Compose>
    <Guidelines>
      <SlotApi>Prefer Slots over boolean flags</SlotApi>
      <Material3>true</Material3>
      <ScaffoldUsage>true</ScaffoldUsage>
      <Navigation>
        <RouteType>String Routes</RouteType>
        <ArgumentPassing>IDs only</ArgumentPassing>
      </Navigation>
      <AnimationOptimization>graphicsLayer()</AnimationOptimization>
    </Guidelines>
  </Compose>

  <ErrorHandling>
    <ResultPattern>true</ResultPattern>
    <TypedErrors>true</TypedErrors>
    <Avoid>Generic Resource Classes with Strings</Avoid>
  </ErrorHandling>

  <DataLayer>
    <Separation>
      <DTOs>API Models</DTOs>
      <DomainModels>Clean UseCase Models</DomainModels>
      <Mapping>Extension Functions</Mapping>
    </Separation>
    <Repositories>
      <Realtime>Flow</Realtime>
      <Oneshot>Result&lt;D,E&gt;</Oneshot>
    </Repositories>
  </DataLayer>

  <Coroutines>
    <InitialLoad>stateIn + SharingStarted.WhileSubscribed</InitialLoad>
    <UICollection>
      <collectAsStateWithLifecycle>true</collectAsStateWithLifecycle>
    </UICollection>
  </Coroutines>

  <Testing>
    <Principles>
      <FakesOverMocks>true</FakesOverMocks>
      <DispatcherInjection>true</DispatcherInjection>
      <Isolation>true</Isolation>
    </Principles>
  </Testing>
</AndroidDeveloperAgent>
