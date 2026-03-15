import strawberry

from app.graphql.resolvers import Query, Subscription

schema = strawberry.Schema(query=Query, subscription=Subscription)
