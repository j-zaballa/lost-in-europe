import { Injectable } from '@nestjs/common';
import { TicketEntity } from '../entities/ticket-base.entity';

@Injectable()
export class TicketSortService {
  // Class properties for degree and adjacency list maps
  private inDeg: Map<string, number> = new Map();
  private outDeg: Map<string, number> = new Map();
  private adjList: Map<string, string[]> = new Map();

  /**
   * The sort method implements Hierholzer's algorithm to find an Eulerian path
   * in the graph of tickets. This way Kevin will be able to reconstruct the
   * family's itinerary and hopefully catch up with them.
   *
   * @param tickets - an array of TicketEntity objects
   * @returns an array of sorted TicketEntity objects or null if no Eulerian path exists
   */
  sort(tickets: TicketEntity[]): TicketEntity[] | null {
    if (!tickets.length) {
      return null;
    }

    // Build the degree maps
    this.buildMaps(tickets);

    // Check if there exists an Eulerian path
    if (!this.hasEulerianPath()) {
      return null;
    }

    // Find a path
    const path = this.dfs(this.findStartNode());

    // Check if the path is valid
    if (!this.isValidPath(path, tickets)) {
      return null;
    }

    // Order the tickets using the path
    return this.orderTicketsFromPath(tickets, path);
  }

  /**
   * Check if the path traverses every edge/ticket. The graph might be
   * disconnected, so we need to check if the path uses every edge/ticket.
   *
   * @param path - an array of strings representing the path
   * @param tickets - an array of TicketEntity objects
   * @returns true if the path is valid, false otherwise
   */
  isValidPath(path: string[], tickets: TicketEntity[]): boolean {
    return path.length === tickets.length + 1;
  }

  /**
   * Builds the in-degree and out-degree maps for each city in the tickets.
   *
   * @param tickets - an array of TicketEntity objects
   */
  private buildMaps(tickets: TicketEntity[]): void {
    this.clearMaps();
    for (const { from, to } of tickets) {
      this.outDeg.set(from, (this.outDeg.get(from) ?? 0) + 1);
      this.inDeg.set(to, (this.inDeg.get(to) ?? 0) + 1);
      this.adjList.set(from, [...(this.adjList.get(from) ?? []), to]);

      // Ensure every city appears in degree maps
      this.inDeg.set(from, this.inDeg.get(from) ?? 0);
      this.outDeg.set(to, this.outDeg.get(to) ?? 0);
    }
  }

  /**
   * Clears the in-degree, out-degree, and adjacency list maps for every
   * sort operation.
   */
  private clearMaps(): void {
    this.inDeg.clear();
    this.outDeg.clear();
    this.adjList.clear();
  }

  /**
   * Checks if there exists an Eulerian path in the graph of tickets.
   *
   * For any city/node, if the difference between the in-degree and out-degree
   * or between the out-degree and in-degree is greater than 1, then there is no
   * Eulerian path. Also, if there are more than 1 start or end nodes, then there
   * is no Eulerian path. Last, if the number of start nodes is not equal to the
   * number of end nodes, then there is no Eulerian path.
   *
   * @returns true if there exists an Eulerian path, false otherwise
   */
  private hasEulerianPath(): boolean {
    let startNodes = 0;
    let endNodes = 0;
    for (const [city, inDegree] of this.inDeg.entries()) {
      const outDegree = this.outDeg.get(city) ?? 0;
      if (Math.abs(inDegree - outDegree) > 1) {
        return false;
      }

      if (inDegree === outDegree) {
        continue;
      }

      if (inDegree < outDegree) {
        endNodes++;
      }

      if (inDegree > outDegree) {
        startNodes++;
      }
    }

    if (startNodes > 1 || endNodes > 1) {
      return false;
    }

    if (startNodes !== endNodes) {
      return false;
    }

    return true;
  }

  /**
   * Finds a valid start node for the Eulerian path.
   * A start node is either a node with out-degree > in-degree or any node
   * if all nodes have balanced degrees.
   *
   * @returns the name of the start city
   */
  private findStartNode(): string {
    // First, look for a node with out-degree > in-degree (start of path)
    for (const [city, inDegree] of this.inDeg.entries()) {
      const outDegree = this.outDeg.get(city) ?? 0;
      if (outDegree > inDegree) {
        return city;
      }
    }

    // If all nodes have balanced degrees, pick any node with outgoing edges.
    // In our case, because the input are tickets (edges), we can pick any node
    // because all nodes have outgoing edges.
    return this.outDeg.keys().next().value;
  }

  /**
   * Performs a depth-first search on the graph of tickets using a closure
   * to maintain state across recursive calls.
   *
   * @param startNode - the name of the starting city
   * @returns an array of sorted cities
   */
  private dfs(startNode: string): string[] {
    const result: string[] = [];

    // This inner function creates a closure over the result array
    const visit = (node: string): void => {
      while (this.outDeg.get(node)! > 0) {
        const nextNode = this.adjList.get(node)!.shift()!;
        this.outDeg.set(node, this.outDeg.get(node)! - 1);
        visit(nextNode);
      }

      // Add the current node to the result after all outgoing edges are processed
      result.push(node);
    };

    // Start the traversal
    visit(startNode);

    // The path needs to be reversed since we're adding nodes in postorder
    return result.reverse();
  }

  /**
   * Orders the tickets based on the path.
   *
   * @param tickets - an array of TicketEntity objects
   * @param path - an array of strings representing the path
   * @returns an array of TicketEntity objects
   */
  private orderTicketsFromPath(tickets: TicketEntity[], path: string[]) {
    // Create a map from 'from-to' pairs to ticket indexes for O(1) lookup
    const ticketMap = new Map<string, number>();
    tickets.forEach((ticket, index) => {
      ticketMap.set(`${ticket.from}-${ticket.to}`, index);
    });

    // Use the path to order the tickets
    const orderedTickets: TicketEntity[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      const ticketIndex = ticketMap.get(`${from}-${to}`);

      if (ticketIndex !== undefined) {
        orderedTickets.push(tickets[ticketIndex]);
      }
    }
    return orderedTickets;
  }
}
