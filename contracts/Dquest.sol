// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

// Mission contract interface
interface Mission {
    function finish(address _user) external view returns (bool);
}

// Dquest contract
contract Dquest {
    // The variables representing the missions
    mapping(uint256 => address) missions;
    uint256 missionCounter;

    // An enumeration to represent the operator type
    enum OperatorType { AND, OR }

    // A struct to represent a node in the tree
    struct Node {
        bool isMission;
        uint8 missionId;
        OperatorType operatorType;
        uint8 leftNode;
        uint8 rightNode;
    }

    // An array to store the nodes in the tree
    Node[] nodes;

    constructor() {
        // nothing yet
    }

    // A function to set the address of a single mission
    function setMission(address _M) public {
        missions[missionCounter] = _M;
        missionCounter ++;
    }

    /*
     * @dev A function to add a node to the tree
     * @notice wrong adding order can fail the entire formula
     * For example given a formula: ((M1 AND M2 AND M3) OR (M4 AND M1))
     * we have the following tree:
     *                             OR(0)
     *                           /        `
     *                          /            `
     *                         /                `
     *                     AND(1)                  `AND(2)
     *                    /      `                 /      `
     *                   /         `              /         `
     *               AND(3)          `M3(4)     M4(5)         `M1(6)
     *              /    `
     *             /       `
     *           M1(7)       `M2(8)
     *
     * The numbers in the parentheses are the indexes of the nodes and each
     * node should be added to the tree in that exact order (0->1->2-> ...)
     * otherwise the entire formula can fail.
     * For example:
     * addNode(0); addNode(1); ... addNode(8);
    */
    function addNode(
        bool isMission,
        uint8 missionId,
        OperatorType operatorType,
        uint8 leftNode,
        uint8 rightNode
    ) public {
        Node memory node;
        node.isMission = isMission;
        node.missionId = missionId;
        node.operatorType = operatorType;
        node.leftNode = leftNode;
        node.rightNode = rightNode;
        nodes.push(node);
    }

    /**
     * @dev A function to evaluate the tree for a user
     * @param nodeId The root node of the formula
     * @param user address of user's to be verified
     */
    function evaluateTree(
        uint8 nodeId,
        address user
    ) private returns (bool) {
        Node memory node = nodes[nodeId];
        if (node.isMission) {
            Mission mission = Mission(missions[node.missionId]);
            return mission.finish(user);
        } else {
            bool leftResult = evaluateTree(node.leftNode, user);
            bool rightResult = evaluateTree(node.rightNode, user);
            if (node.operatorType == OperatorType.AND) {
                return leftResult && rightResult;
            } else {
                return leftResult || rightResult;
            }
        }
    }

    // A function to evaluate the user's combination
    function questDone(address user) public returns (bool) {
        // Return the result of the evaluation of the root node
        return evaluateTree(0, user);
    }
}
